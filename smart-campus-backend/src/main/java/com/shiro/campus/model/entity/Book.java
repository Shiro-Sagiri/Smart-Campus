package com.shiro.campus.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

/**
 *
 */
@TableName(value = "book")
@Data
public class Book {
    /**
     * 图书ID
     */
    @TableId(type = IdType.AUTO)
    private Integer bookId;

    /**
     * 简介
     */
    private String description;

    /**
     * 书名
     */
    private String title;

    /**
     * 封面URL
     */
    private String cover;

    /**
     * 作者
     */
    private String author;

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

    /**
     * 逻辑删除
     */
    private Integer isDeleted;
}