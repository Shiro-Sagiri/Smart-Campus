package com.shiro.campus.model.dto.course;

import com.baomidou.mybatisplus.annotation.TableField;
import com.shiro.campus.common.PageRequest;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 *
 */
@Data
public class CourseQueryRequest extends PageRequest {


    /**
     * 课程名称
     */
    private String courseName;

    /**
     * 授课教师ID
     */
    private String teacherId;

}