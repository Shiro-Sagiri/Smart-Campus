package com.shiro.campus.model.dto.book;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;

@Data
public class BookUpdateRequest implements Serializable {

    @NotNull(message = "书名不能为空！")
    private String title;

    private String cover;

    @NotNull(message = "作者不能为空！")
    private String author;

    /**
     * 简介
     */
    private String description;

    /**
     * 出版社名称
     */
    private String publisherName;

    /**
     * 出版日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private LocalDate publishDate;

    /**
     * 馆藏总量
     */
    private Integer total;

    /**
     * 借出数量
     */
    private Integer borrowedNum;

}
