package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.model.dto.course.CourseQueryRequest;
import com.shiro.campus.model.entity.Course;
import com.baomidou.mybatisplus.extension.service.IService;
import jakarta.validation.Valid;

/**
* @author ly179
*/
public interface CourseService extends IService<Course> {

    IPage<Course> listCourseByPage(@Valid CourseQueryRequest courseQueryRequest);
}
