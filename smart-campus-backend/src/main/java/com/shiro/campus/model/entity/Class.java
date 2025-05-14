package com.shiro.campus.model.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 
 * @TableName class
 */
@TableName(value ="class")
@Data
public class Class implements Serializable {
    /**
     * 班级ID
     */
    @TableId
    private String classId;

    /**
     * 所属专业
     */
    private String majorId;

    /**
     * 班主任工号
     */
    private String headTeacherId;

    /**
     * 入学年份
     */
    private String admissionYear;

    /**
     * 学生人数
     */
    private Integer studentCount;


    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}