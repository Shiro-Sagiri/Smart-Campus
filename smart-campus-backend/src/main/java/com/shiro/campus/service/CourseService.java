package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shiro.campus.model.dto.course.CourseQueryRequest;
import com.shiro.campus.model.entity.Course;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.List;

/**
 * @author ly179
 */
public interface CourseService extends IService<Course> {

    IPage<Course> listCourseByPage(@Valid CourseQueryRequest courseQueryRequest);

    void selectCourse(Integer courseId, String studentId);

    IPage<Course> listMyCourseByPage(@Valid CourseQueryRequest courseQueryRequest, HttpServletRequest request);

    List<Course> getMyCourseTimetable(String semester,HttpServletRequest request);
}
