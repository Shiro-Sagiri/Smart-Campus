package com.shiro.campus.model.dto.course;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 *
 */
@Data
public class CourseUpdateRequest implements Serializable {


    /**
     * 课程名称
     */
    @NotNull(message = "课程名称不能为空")
    private String courseName;

    /**
     * 学分
     */
    @NotNull(message = "学分不能为空")
    private Double credit;

    /**
     * 授课教师ID
     */
    @NotNull(message = "授课教师ID不能为空")
    private String teacherId;

    /**
     * 最大选课人数
     */
    @NotNull(message = "最大选课人数不能为空")
    private Integer maxCapacity;

    /**
     * 上课时间
     */
    @NotNull(message = "上课时间不能为空")
    private String classTime;

    /**
     * 教室地点
     */
    @NotNull(message = "教室地点不能为空")
    private String location;

    @Serial
    private static final long serialVersionUID = 1L;

}