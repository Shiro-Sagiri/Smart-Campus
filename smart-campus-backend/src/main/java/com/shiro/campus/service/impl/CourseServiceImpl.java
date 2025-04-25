package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.mapper.CourseMapper;
import com.shiro.campus.model.dto.course.CourseQueryRequest;
import com.shiro.campus.model.entity.Course;
import com.shiro.campus.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author ly179
 */
@Service
public class CourseServiceImpl extends ServiceImpl<CourseMapper, Course>
        implements CourseService {

    private final CourseMapper courseMapper;

    public CourseServiceImpl(CourseMapper courseMapper) {
        this.courseMapper = courseMapper;
    }

    @Override
    public IPage<Course> listCourseByPage(CourseQueryRequest courseQueryRequest) {
        LambdaQueryWrapper<Course> wrapper = buildQueryWrapper(courseQueryRequest);
        int current = courseQueryRequest.getCurrent();
        int pageSize = courseQueryRequest.getPageSize();
        return courseMapper.selectPage(new Page<>(current, pageSize), wrapper);
    }

    private LambdaQueryWrapper<Course> buildQueryWrapper(CourseQueryRequest request) {
        LambdaQueryWrapper<Course> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getCourseName()).ifPresent(name -> wrapper.like(Course::getCourseName, name));
        Optional.ofNullable(request.getTeacherId()).ifPresent(id -> wrapper.eq(Course::getTeacherId, id));
        return wrapper;
    }
}




