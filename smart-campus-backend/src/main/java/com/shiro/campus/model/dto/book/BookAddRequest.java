package com.shiro.campus.model.dto.book;

import com.shiro.campus.model.enums.BookStatusEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class BookAddRequest implements Serializable {

    @NotNull(message = "书名不能为空！")
    private String title;
    
    private String cover;

    @NotNull(message = "作者不能为空！")
    private String author;

    @NotNull(message = "状态不能为空！")
    private BookStatusEnum status;

}
