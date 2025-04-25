package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.course.CourseAddRequest;
import com.shiro.campus.model.dto.course.CourseQueryRequest;
import com.shiro.campus.model.dto.course.CourseUpdateRequest;
import com.shiro.campus.model.entity.Course;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.model.enums.UserRoleEnum;
import com.shiro.campus.service.CourseService;
import com.shiro.campus.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/course")
public class CourseController {

    private final CourseService courseService;
    private final UserService userService;

    public CourseController(CourseService courseService, UserService userService) {
        this.courseService = courseService;
        this.userService = userService;
    }

    @Operation(summary = "新增课程")
    @PostMapping("/add/single")
    public BaseResponse<Void> addCourse(@Valid @RequestBody CourseAddRequest courseAddRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(courseAddRequest), ErrorCode.PARAMS_ERROR);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserId, courseAddRequest.getTeacherId());
        User teacher = userService.getOne(wrapper);
        ThrowUtils.throwIf(ObjectUtil.isNull(teacher) || teacher.getRole() != UserRoleEnum.TEACHER, ErrorCode.PARAMS_ERROR, "该老师不存在!");
        Course course = new Course();
        BeanUtils.copyProperties(courseAddRequest, course);
        courseService.save(course);
        return ResultUtils.success("添加成功！");
    }

    @Operation(summary = "分页获取课程列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<Course>> listCourseByPage(@Valid @RequestBody CourseQueryRequest courseQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(courseQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(courseService.listCourseByPage(courseQueryRequest));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取课程")
    public BaseResponse<Course> getCourseById(@PathVariable String id) {
        Course course = courseService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(course), ErrorCode.PARAMS_ERROR, "课程不存在");
        return ResultUtils.success(course);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除课程")
    public BaseResponse<Void> deleteCourseById(@PathVariable String id) {
        Course course = courseService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(course), ErrorCode.PARAMS_ERROR, "课程不存在！");
        courseService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新课程")
    public BaseResponse<Void> updateCourseById(@RequestBody CourseUpdateRequest courseUpdateRequest, @PathVariable Integer id) {
        ThrowUtils.throwIf(ObjectUtil.isNull(courseUpdateRequest), ErrorCode.PARAMS_ERROR);
        Course course = new Course();
        BeanUtils.copyProperties(courseUpdateRequest, course);
        course.setCourseId(id);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserId, courseUpdateRequest.getTeacherId());
        User teacher = userService.getOne(wrapper);
        ThrowUtils.throwIf(ObjectUtil.isNull(teacher) || teacher.getRole() != UserRoleEnum.TEACHER, ErrorCode.PARAMS_ERROR, "该老师不存在!");
        courseService.updateById(course);
        return ResultUtils.success("更新成功!");
    }
}
