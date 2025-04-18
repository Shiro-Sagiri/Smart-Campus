package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shiro.campus.model.dto.book.BookAddRequest;
import com.shiro.campus.model.dto.book.BookQueryRequest;
import com.shiro.campus.model.entity.Book;
import jakarta.validation.Valid;

/**
* @author ly179
*/
public interface BookService extends IService<Book> {

    void addBook(@Valid BookAddRequest bookAddRequest);

    IPage<Book> listBookByPage(@Valid BookQueryRequest bookQueryRequest);
}
