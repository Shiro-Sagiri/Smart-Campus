package com.shiro.campus.service.impl;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.mapper.BookMapper;
import com.shiro.campus.mapper.BorrowRecordMapper;
import com.shiro.campus.model.dto.book.BookAddRequest;
import com.shiro.campus.model.dto.book.BookQueryRequest;
import com.shiro.campus.model.entity.Book;
import com.shiro.campus.model.entity.BorrowRecord;
import com.shiro.campus.model.vo.BorrowedBookVO;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.BookService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author ly179
 */
@Service
public class BookServiceImpl extends ServiceImpl<BookMapper, Book> implements BookService {

    private final BookMapper bookMapper;
    private final BorrowRecordMapper borrowRecordMapper;

    public BookServiceImpl(BookMapper bookMapper, BorrowRecordMapper borrowRecordMapper) {
        this.bookMapper = bookMapper;
        this.borrowRecordMapper = borrowRecordMapper;
    }

    @Override
    public void addBook(BookAddRequest bookAddRequest) {
        Book book = new Book();
        BeanUtils.copyProperties(bookAddRequest, book);
        bookMapper.insert(book);
    }

    @Override
    public IPage<BorrowedBookVO> listBorrowedBookByPage(BookQueryRequest bookQueryRequest, HttpServletRequest request) {
        String userId = ((UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE)).getUserId();
        LambdaQueryWrapper<BorrowRecord> borrowRecordQueryWrapper = new LambdaQueryWrapper<>();
        borrowRecordQueryWrapper.eq(BorrowRecord::getUserId, userId);
        IPage<BorrowRecord> borrowRecordIPage = borrowRecordMapper.selectPage(new Page<>(bookQueryRequest.getCurrent(), bookQueryRequest.getPageSize()), borrowRecordQueryWrapper);
        IPage<BorrowedBookVO> borrowedBookVOIPage = new Page<>(borrowRecordIPage.getCurrent(), borrowRecordIPage.getSize(), borrowRecordIPage.getTotal());
        List<BorrowedBookVO> borrowedBookVOList = new ArrayList<>();
        for (BorrowRecord record : borrowRecordIPage.getRecords()) {
            Book book = bookMapper.selectById(record.getBookId());
            BorrowedBookVO borrowedBookVO = new BorrowedBookVO();
            BeanUtils.copyProperties(book, borrowedBookVO);
            borrowedBookVO.setDueTime(record.getDueTime());
            borrowedBookVO.setReturnTime(record.getReturnTime());
            borrowedBookVO.setFine(record.getFine());
            borrowedBookVO.setRecordId(record.getRecordId());
            borrowedBookVO.setIsPay(record.getIsPay());
            borrowedBookVO.setBorrowTime(record.getBorrowTime());
            borrowedBookVOList.add(borrowedBookVO);
        }
        borrowedBookVOIPage.setRecords(borrowedBookVOList);
        return borrowedBookVOIPage;
    }

    @Override
    public void returnBook(Book book, HttpServletRequest request) {
        // 1. 获取当前用户的借阅记录
        String userId = ((UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE)).getUserId();
        LambdaQueryWrapper<BorrowRecord> borrowRecordQueryWrapper = new LambdaQueryWrapper<>();
        borrowRecordQueryWrapper.eq(BorrowRecord::getUserId, userId).eq(BorrowRecord::getBookId, book.getBookId()).isNull(BorrowRecord::getReturnTime);
        BorrowRecord borrowRecord = borrowRecordMapper.selectOne(borrowRecordQueryWrapper, false);
        //超出归还时间，超出每天需罚款3元
        LocalDate now = LocalDate.now();
        if (borrowRecord.getDueTime().isBefore(now)) {
            long days = borrowRecord.getDueTime().until(now).getDays();
            borrowRecord.setFine(BigDecimal.valueOf(days * 3));
        }
        book.setBorrowedNum(book.getBorrowedNum() - 1);
        // 2. 更新借阅记录
        borrowRecord.setReturnTime(LocalDateTime.now());
        borrowRecordMapper.updateById(borrowRecord);
        // 3. 更新图书信息
        bookMapper.updateById(book);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void borrowBook(Book book, LocalDate dueTime, HttpServletRequest request) {
        ThrowUtils.throwIf(book.getBorrowedNum() >= book.getTotal(), ErrorCode.PARAMS_ERROR, "借阅数量超过最大值");
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        LambdaQueryWrapper<BorrowRecord> borrowRecordQueryWrapper = new LambdaQueryWrapper<>();
        borrowRecordQueryWrapper.eq(BorrowRecord::getUserId, userVO.getUserId()).eq(BorrowRecord::getBookId, book.getBookId()).isNull(BorrowRecord::getReturnTime);
        ThrowUtils.throwIf(ObjectUtil.isNotNull(borrowRecordMapper.selectOne(borrowRecordQueryWrapper, false)), ErrorCode.PARAMS_ERROR, "该书籍已借阅，请归还后再借阅");
        book.setBorrowedNum(book.getBorrowedNum() + 1);
        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setBookId(book.getBookId());
        borrowRecord.setUserId(userVO.getUserId());
        borrowRecord.setDueTime(dueTime);
        borrowRecordMapper.insert(borrowRecord);
        bookMapper.updateById(book);
    }

    @Override
    public IPage<Book> listBookByPage(BookQueryRequest bookQueryRequest) {
        LambdaQueryWrapper<Book> wrapper = buildQueryWrapper(bookQueryRequest);
        int current = bookQueryRequest.getCurrent();
        int pageSize = bookQueryRequest.getPageSize();
        return bookMapper.selectPage(new Page<>(current, pageSize), wrapper);
    }

    // 构建查询条件
    private LambdaQueryWrapper<Book> buildQueryWrapper(BookQueryRequest request) {
        LambdaQueryWrapper<Book> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getAuthor()).ifPresent(name -> wrapper.like(Book::getAuthor, name));
        Optional.ofNullable(request.getSearch()).ifPresent(name -> wrapper.like(Book::getAuthor, name).or().like(Book::getTitle, name));
        Optional.ofNullable(request.getTitle()).ifPresent(id -> wrapper.like(Book::getTitle, id)); // 根据业务需求决定使用 eq 或 like
        return wrapper;
    }
}




