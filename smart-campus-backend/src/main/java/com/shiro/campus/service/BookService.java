package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shiro.campus.model.dto.book.BookAddRequest;
import com.shiro.campus.model.dto.book.BookQueryRequest;
import com.shiro.campus.model.entity.Book;
import com.shiro.campus.model.vo.BorrowedBookVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.time.LocalDate;

/**
 * @author ly179
 */
public interface BookService extends IService<Book> {

    void addBook(@Valid BookAddRequest bookAddRequest);

    IPage<Book> listBookByPage(@Valid BookQueryRequest bookQueryRequest);

    void borrowBook(Book book, LocalDate dueTime, HttpServletRequest request);

    void returnBook(Book book, HttpServletRequest request);

    IPage<BorrowedBookVO> listBorrowedBookByPage(@Valid BookQueryRequest bookQueryRequest, HttpServletRequest request);
}
