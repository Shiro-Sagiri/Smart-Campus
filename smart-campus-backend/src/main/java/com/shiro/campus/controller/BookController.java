package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.book.BookAddRequest;
import com.shiro.campus.model.dto.book.BookQueryRequest;
import com.shiro.campus.model.dto.book.BookUpdateRequest;
import com.shiro.campus.model.entity.Book;
import com.shiro.campus.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/book")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
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
}
