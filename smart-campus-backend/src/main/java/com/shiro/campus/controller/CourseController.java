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
import com.shiro.campus.model.entity.CourseQuestion;
import com.shiro.campus.service.CourseQuestionService;
import com.shiro.campus.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @Operation(summary = "新增问卷")
    @PostMapping("/add/single")
    public BaseResponse<Void> addCourse(@Valid @RequestBody CourseAddRequest courseAddRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(courseAddRequest), ErrorCode.PARAMS_ERROR);
        courseService.addCourse(courseAddRequest, request);
        return ResultUtils.success("添加成功！");
    }

    @Operation(summary = "分页获取问卷列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<Course>> listCourseByPage(@Valid @RequestBody CourseQueryRequest courseQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(courseQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(courseService.listCourseByPage(courseQueryRequest));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取问卷")
    public BaseResponse<CourseVO> getCourseVOById(@PathVariable String id) {
        Course course = courseService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(course), ErrorCode.PARAMS_ERROR, "问卷不存在");
        CourseVO courseVO = new CourseVO();
        BeanUtils.copyProperties(course, courseVO);
        LambdaQueryWrapper<CourseQuestion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CourseQuestion::getCourseId, id);
        List<CourseQuestion> questionList = courseQuestionService.list(wrapper);
        courseVO.setQuestionList(questionList);
        return ResultUtils.success(courseVO);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除问卷")
    public BaseResponse<Void> deleteCourseById(@PathVariable String id) {
        Course course = courseService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(course), ErrorCode.PARAMS_ERROR, "问卷不存在！");
        courseService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新问卷")
    public BaseResponse<Void> updateCourseById(@RequestBody CourseUpdateRequest courseUpdateRequest, @PathVariable Integer id, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(courseUpdateRequest), ErrorCode.PARAMS_ERROR);
        courseService.updateCourse(courseUpdateRequest, id, request);
        return ResultUtils.success("更新成功!");
    }
}
