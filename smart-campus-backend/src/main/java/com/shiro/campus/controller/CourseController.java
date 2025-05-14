package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.course.CourseAddRequest;
import com.shiro.campus.model.dto.course.CourseQueryRequest;
import com.shiro.campus.model.dto.course.CourseUpdateRequest;
import com.shiro.campus.model.dto.courseComment.CourseCommentAddRequest;
import com.shiro.campus.model.entity.Course;
import com.shiro.campus.model.entity.CourseEvaluation;
import com.shiro.campus.model.entity.CourseSelection;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.model.enums.UserRoleEnum;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.CourseEvaluationService;
import com.shiro.campus.service.CourseSelectionService;
import com.shiro.campus.service.CourseService;
import com.shiro.campus.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/course")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final UserService userService;
    private final CourseSelectionService courseSelectionService;
    private final CourseEvaluationService courseEvaluationService;


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

    //选课
    @PostMapping("/select/{courseId}/{studentId}")
    @Operation(summary = "选课")
    public BaseResponse<Void> selectCourse(@PathVariable Integer courseId, @PathVariable String studentId) {
        Course course = courseService.getById(courseId);
        ThrowUtils.throwIf(ObjectUtil.isNull(course), ErrorCode.PARAMS_ERROR, "课程不存在！");
        courseService.selectCourse(courseId, studentId);
        return ResultUtils.success("选课成功！");
    }

    //退选
    @PostMapping("/unselect/{courseId}/{studentId}")
    @Operation(summary = "退选课程")
    public BaseResponse<Void> unselectCourse(@PathVariable Integer courseId, @PathVariable String studentId) {
        Course course = courseService.getById(courseId);
        ThrowUtils.throwIf(ObjectUtil.isNull(course), ErrorCode.PARAMS_ERROR, "课程不存在！");
        LambdaQueryWrapper<CourseSelection> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CourseSelection::getCourseId, courseId);
        wrapper.eq(CourseSelection::getStudentId, studentId);
        CourseSelection courseSelection = courseSelectionService.getOne(wrapper);
        ThrowUtils.throwIf(ObjectUtil.isNull(courseSelection), ErrorCode.PARAMS_ERROR, "未选该课程！");
        courseSelectionService.removeById(courseSelection);
        course.setSelected(course.getSelected() - 1);
        courseService.updateById(course);
        return ResultUtils.success("退选成功！");
    }

    //分页获取登录用户的选课列表
    @PostMapping("/my/course/page/list")
    @Operation(summary = "分页获取登录用户的选课列表")
    public BaseResponse<IPage<Course>> listMyCourseByPage(@Valid @RequestBody CourseQueryRequest courseQueryRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(courseQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(courseService.listMyCourseByPage(courseQueryRequest, request));
    }

    //获取我的课程表信息
    @GetMapping("/my/course/timetable")
    @Operation(summary = "获取我的课程表信息")
    public BaseResponse<List<Course>> getMyCourseTimetable(String semester, HttpServletRequest request) {
        return ResultUtils.success(courseService.getMyCourseTimetable(semester,request));
    }

    //课程评价
    @Operation(summary = "课程评价")
    @PostMapping("/evaluate")
    public BaseResponse<Void> evaluateCourse(@RequestBody CourseCommentAddRequest courseCommentAddRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(courseCommentAddRequest), ErrorCode.PARAMS_ERROR);
        CourseEvaluation courseEvaluation = new CourseEvaluation();
        BeanUtils.copyProperties(courseCommentAddRequest, courseEvaluation);
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        courseEvaluation.setStudentId(userVO.getUserId());
        courseEvaluationService.save(courseEvaluation);
        return ResultUtils.success("评价成功！");
    }

    //获取课程评价列表
    @Operation(summary = "获取课程评价列表")
    @GetMapping("/evaluate/list")
    public BaseResponse<Map<String, List<CourseEvaluation>>> getCourseEvaluationList(HttpServletRequest request) {
        Map<String, List<CourseEvaluation>> courseEvaluationMap = new HashMap<>();
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        LambdaQueryWrapper<Course> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Course::getTeacherId, userVO.getUserId());
        List<Course> courseList = courseService.list(wrapper);
        courseList.forEach(course -> {
            LambdaQueryWrapper<CourseEvaluation> courseEvaluationWrapper = new LambdaQueryWrapper<>();
            courseEvaluationWrapper.eq(CourseEvaluation::getCourseId, course.getCourseId());
            List<CourseEvaluation> courseEvaluations = courseEvaluationService.list(courseEvaluationWrapper);
            courseEvaluationMap.put(course.getCourseName(), courseEvaluations);
        });
        return ResultUtils.success(courseEvaluationMap);
    }
}
