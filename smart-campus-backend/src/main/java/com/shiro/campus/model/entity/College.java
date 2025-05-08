package com.shiro.campus.model.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * 
 * @TableName college
 */
@TableName(value ="college")
@Data
public class College implements Serializable {
    /**
     * 学院编号
     */
    @TableId
    private String collegeId;

    /**
     * 学院名称
     */
    private String collegeName;

    /**
     * 学院简介
     */
    private String description;

    /**
     * 逻辑删除标记
     */
    private Integer isDeleted;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}