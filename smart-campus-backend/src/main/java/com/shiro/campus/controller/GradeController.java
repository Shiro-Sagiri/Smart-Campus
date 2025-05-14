package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.model.dto.grade.GradeAddRequest;
import com.shiro.campus.model.dto.grade.GradeQueryRequest;
import com.shiro.campus.model.dto.user.UserQueryRequest;
import com.shiro.campus.model.entity.Class;
import com.shiro.campus.model.entity.Grade;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.model.vo.GradeVO;
import com.shiro.campus.model.vo.RankVO;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.ClassService;
import com.shiro.campus.service.CourseService;
import com.shiro.campus.service.GradeService;
import com.shiro.campus.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grade")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;
    private final CourseService courseService;
    private final UserService userService;
    private final ClassService classService;

    //根据课程id分页获取该课程学生列表
    @Operation(summary = "根据课程id分页获取该课程学生列表")
    @PostMapping("/page/list/student/{id}")
    public BaseResponse<IPage<UserVO>> listStudentByPage(@RequestBody UserQueryRequest userQueryRequest, @PathVariable Integer id) {
        return ResultUtils.success(gradeService.listStudentByPage(userQueryRequest, id));
    }

    //登记成绩
    @Operation(summary = "登记成绩")
    @PostMapping("/add")
    public BaseResponse<Void> addGrade(@RequestBody GradeAddRequest gradeAddRequest) {
        LambdaQueryWrapper<Grade> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Grade::getStudentId, gradeAddRequest.getStudentId());
        wrapper.eq(Grade::getCourseId, gradeAddRequest.getCourseId());
        //判断成绩是否已存在
        Grade g = gradeService.getOne(wrapper);
        if (ObjectUtil.isNotEmpty(g)) {
            g.setScore(gradeAddRequest.getScore());
            gradeService.updateById(g);
            return ResultUtils.success("修改成功");
        } else {
            Grade grade = new Grade();
            BeanUtils.copyProperties(gradeAddRequest, grade);
            gradeService.save(grade);
            return ResultUtils.success("登记成功");
        }
    }

    //根据学生id列表和课程id获取成绩列表
    @Operation(summary = "根据学生id列表和课程id获取成绩列表")
    @PostMapping("/list/{courseId}")
    public BaseResponse<List<Grade>> listGradesByStudentIds(@RequestBody List<String> studentIds, @PathVariable Integer courseId) {
        LambdaQueryWrapper<Grade> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Grade::getCourseId, courseId);
        wrapper.in(Grade::getStudentId, studentIds);
        return ResultUtils.success(gradeService.list(wrapper));
    }

    //获取登录用户的成绩列表
    @Operation(summary = "获取登录用户的成绩列表")
    @PostMapping("/list")
    public BaseResponse<IPage<GradeVO>> listGrades(@RequestBody GradeQueryRequest gradeQueryRequest, HttpServletRequest request) {
        return ResultUtils.success(gradeService.listByPage(gradeQueryRequest, request));
    }

    //获取登录用户的rank
    @Operation(summary = "获取登录用户的排名信息")
    @GetMapping("/rank")
    public BaseResponse<RankVO> getGPA(HttpServletRequest request) {
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        Double GPA = gradeService.getGPA(userVO.getUserId());
        RankVO rankVO = new RankVO();
        rankVO.setGPA(GPA);
        rankVO.setStudentId(userVO.getUserId());
        rankVO.setStudentName(userVO.getUserName());
        LambdaQueryWrapper<Grade> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Grade::getStudentId, userVO.getUserId());
        List<Grade> gradeList = gradeService.list(wrapper);
        Double totalCredit = 0.0;
        Double requiredCredit = 0.0;
        Double failCredit = 0.0;
        Integer totalCourse = 0;
        for (Grade grade : gradeList) {
            totalCredit += courseService.getById(grade.getCourseId()).getCredit().doubleValue();
            if (grade.getScore() >= 60) {
                requiredCredit += courseService.getById(grade.getCourseId()).getCredit().doubleValue();
            } else {
                failCredit += courseService.getById(grade.getCourseId()).getCredit().doubleValue();
            }
            totalCourse++;
        }
        rankVO.setTotalCredit(totalCredit);
        rankVO.setRequiredCredit(requiredCredit);
        rankVO.setFailCredit(failCredit);
        rankVO.setTotalCourse(totalCourse);
        LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
        userWrapper.eq(User::getClassId, userVO.getClassId());
        List<User> userList = userService.list(userWrapper);
        int classRank = 1;
        for (User user : userList) {
            if (user.getUserId().equals(userVO.getUserId())) {
                break;
            }
            Double GPA1 = gradeService.getGPA(user.getUserId());
            if (GPA1 > GPA) {
                classRank++;
            }
        }
        rankVO.setClassRank(classRank);
        String majorId = userVO.getUserId().substring(2, 6);
        LambdaQueryWrapper<Class> classLambdaQueryWrapper = new LambdaQueryWrapper<>();
        classLambdaQueryWrapper.eq(Class::getMajorId, majorId);
        List<String> classIdList = classService.list(classLambdaQueryWrapper).stream().map(Class::getClassId).toList();
        LambdaQueryWrapper<User> majorWrapper = new LambdaQueryWrapper<>();
        majorWrapper.in(User::getClassId, classIdList);
        List<User> majorList = userService.list(majorWrapper);
        int majorRank = 1;
        for (User user : majorList) {
            if (user.getUserId().equals(userVO.getUserId())) {
                break;
            }
            Double GPA1 = gradeService.getGPA(user.getUserId());
            if (GPA1 > GPA) {
                majorRank++;
            }
        }
        rankVO.setMajorRank(majorRank);
        return ResultUtils.success(rankVO);
    }
}
