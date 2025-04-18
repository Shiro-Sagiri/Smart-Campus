package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.mapper.BookMapper;
import com.shiro.campus.model.dto.book.BookAddRequest;
import com.shiro.campus.model.dto.book.BookQueryRequest;
import com.shiro.campus.model.entity.Book;
import com.shiro.campus.service.BookService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author ly179
 */
@Service
public class BookServiceImpl extends ServiceImpl<BookMapper, Book>
        implements BookService {

    private final BookMapper bookMapper;

    public BookServiceImpl(BookMapper bookMapper) {
        this.bookMapper = bookMapper;
    }

    @Override
    public void addBook(BookAddRequest bookAddRequest) {
        Book book = new Book();
        BeanUtils.copyProperties(bookAddRequest, book);
        bookMapper.insert(book);
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
        Optional.ofNullable(request.getAuthor()).ifPresent(name ->
                wrapper.like(Book::getAuthor, name));
        Optional.ofNullable(request.getTitle()).ifPresent(id ->
                wrapper.like(Book::getTitle, id)); // 根据业务需求决定使用 eq 或 like
        Optional.ofNullable(request.getStatus()).ifPresent(role ->
                wrapper.eq(Book::getStatus, role));
        return wrapper;
    }
}




