package com.shiro.campus.model.vo;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GradeVO {

    private Integer courseId;
    /**
     * 课程名称
     */
    private String courseName;

    /**
     * 学期（格式：YYYY-YYYY-1/2，如2023-2024-1）
     */
    private String semester;

    /**
     * 学分
     */
    private BigDecimal credit;

    /**
     * 授课教师ID
     */
    private String teacherId;

    /**
     * 总学时
     */
    private Integer hours;

    private Double score;

    private Boolean isComment; // 是否已评价
}
