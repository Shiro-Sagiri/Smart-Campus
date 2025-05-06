package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.book.BookAddRequest;
import com.shiro.campus.model.dto.book.BookQueryRequest;
import com.shiro.campus.model.dto.book.BookUpdateRequest;
import com.shiro.campus.model.entity.Book;
import com.shiro.campus.model.entity.BorrowRecord;
import com.shiro.campus.model.entity.CampusCard;
import com.shiro.campus.model.entity.Transaction;
import com.shiro.campus.model.enums.TransactionTypeEnum;
import com.shiro.campus.model.vo.BorrowedBookVO;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.BookService;
import com.shiro.campus.service.BorrowRecordService;
import com.shiro.campus.service.CampusCardService;
import com.shiro.campus.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/book")
public class BookController {
    private final BookService bookService;
    private final CampusCardService campusCardService;
    private final TransactionService transactionService;
    private final BorrowRecordService borrowRecordService;

    public BookController(BookService bookService, CampusCardService campusCardService, TransactionService transactionService, BorrowRecordService borrowRecordService) {
        this.bookService = bookService;
        this.campusCardService = campusCardService;
        this.transactionService = transactionService;
        this.borrowRecordService = borrowRecordService;
    }

    @Operation(summary = "新增图书")
    @PostMapping("/add/single")
    public BaseResponse<Void> addBook(@Valid @RequestBody BookAddRequest bookAddRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(bookAddRequest), ErrorCode.PARAMS_ERROR);
        bookService.addBook(bookAddRequest);
        return ResultUtils.success("添加成功！");
    }

    @Operation(summary = "分页获取图书列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<Book>> listBookByPage(@Valid @RequestBody BookQueryRequest bookQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(bookQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(bookService.listBookByPage(bookQueryRequest));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取图书")
    public BaseResponse<Book> getBookById(@PathVariable String id) {
        Book book = bookService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(book), ErrorCode.PARAMS_ERROR, "图书不存在");
        return ResultUtils.success(book);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除图书")
    public BaseResponse<Void> deleteBookById(@PathVariable String id) {
        Book book = bookService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(book), ErrorCode.PARAMS_ERROR, "图书不存在！");
        bookService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新图书")
    public BaseResponse<Void> updateBookById(@RequestBody BookUpdateRequest bookUpdateRequest, @PathVariable Integer id) {
        ThrowUtils.throwIf(ObjectUtil.isNull(bookUpdateRequest), ErrorCode.PARAMS_ERROR);
        Book book = new Book();
        BeanUtils.copyProperties(bookUpdateRequest, book);
        book.setBookId(id);
        bookService.updateById(book);
        return ResultUtils.success("更新成功!");
    }

    //借阅图书
    @PostMapping("/borrow/{id}")
    @Operation(summary = "借阅图书")
    public BaseResponse<Void> borrowBook(@PathVariable Integer id, LocalDate dueTime, HttpServletRequest request) {
        Book book = bookService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(book), ErrorCode.PARAMS_ERROR, "图书不存在！");
        bookService.borrowBook(book, dueTime, request);
        return ResultUtils.success("借阅成功!");
    }

    //归还图书
    @PostMapping("/return/{id}")
    @Operation(summary = "归还图书")
    public BaseResponse<Void> returnBook(@PathVariable Integer id, HttpServletRequest request) {
        Book book = bookService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(book), ErrorCode.PARAMS_ERROR, "图书不存在！");
        bookService.returnBook(book, request);
        return ResultUtils.success("归还成功!");
    }

    //分页获取登录用户借阅的图书
    @PostMapping("/borrowed/page/list")
    @Operation(summary = "分页获取登录用户借阅的图书")
    public BaseResponse<IPage<BorrowedBookVO>> listBorrowedBookByPage(@Valid @RequestBody BookQueryRequest bookQueryRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(bookQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(bookService.listBorrowedBookByPage(bookQueryRequest, request));
    }

    //缴纳罚款
    @PostMapping("/pay/fine/{id}")
    @Operation(summary = "缴纳罚款")
    @Transactional(rollbackFor = Exception.class)
    public BaseResponse<Void> payFine(@PathVariable Integer id, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(id), ErrorCode.PARAMS_ERROR);
        String userId = ((UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE)).getUserId();
        LambdaQueryWrapper<BorrowRecord> borrowRecordQueryWrapper = new LambdaQueryWrapper<>();
        BorrowRecord borrowRecord = borrowRecordService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(borrowRecord), ErrorCode.PARAMS_ERROR, "罚款记录不存在！");
        ThrowUtils.throwIf(borrowRecord.getIsPay() == 1, ErrorCode.PARAMS_ERROR, "罚款已缴纳！");
        // 1. 更新罚款记录
        borrowRecord.setIsPay(1);
        borrowRecordService.updateById(borrowRecord);
        // 2. 更新校园卡余额
        LambdaQueryWrapper<CampusCard> campusCardQueryWrapper = new LambdaQueryWrapper<>();
        campusCardQueryWrapper.eq(CampusCard::getUserId, userId);
        CampusCard campusCard = campusCardService.getOne(campusCardQueryWrapper);
        ThrowUtils.throwIf(ObjectUtil.isNull(campusCard), ErrorCode.PARAMS_ERROR, "校园卡未注册！");
        ThrowUtils.throwIf(campusCard.getBalance().compareTo(borrowRecord.getFine()) < 0, ErrorCode.PARAMS_ERROR, "校园卡余额不足！");
        campusCard.setBalance(campusCard.getBalance().subtract(borrowRecord.getFine()));
        campusCardService.updateById(campusCard);
        // 3. 记录交易流水
        Transaction transaction = new Transaction();
        transaction.setCardId(campusCard.getCardId());
        transaction.setType(TransactionTypeEnum.SPEND);
        transaction.setAmount(borrowRecord.getFine());
        transactionService.save(transaction);
        return ResultUtils.success("缴纳成功!");
    }
}
