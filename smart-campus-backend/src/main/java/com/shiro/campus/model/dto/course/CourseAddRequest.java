package com.shiro.campus.model.dto.course;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 *
 */
@Data
public class CourseAddRequest implements Serializable {


    /**
     * 课程名称
     */
    private String courseName;

    /**
     * 学分
     */
    private Double credit;

    /**
     * 授课教师ID
     */
    private String teacherId;

    /**
     * 最大选课人数
     */
    private Integer maxCapacity;

    /**
     * 上课时间
     */
    private String classTime;

    /**
     * 教室地点
     */
    private String location;

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}