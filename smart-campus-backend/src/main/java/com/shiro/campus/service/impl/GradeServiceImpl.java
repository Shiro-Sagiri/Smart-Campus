package com.shiro.campus.service.impl;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.mapper.CourseEvaluationMapper;
import com.shiro.campus.mapper.CourseMapper;
import com.shiro.campus.mapper.GradeMapper;
import com.shiro.campus.mapper.UserMapper;
import com.shiro.campus.model.dto.grade.GradeQueryRequest;
import com.shiro.campus.model.dto.user.UserQueryRequest;
import com.shiro.campus.model.entity.Course;
import com.shiro.campus.model.entity.CourseEvaluation;
import com.shiro.campus.model.entity.Grade;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.model.vo.GradeVO;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.GradeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author ly179
 * @description 针对表【grade】的数据库操作Service实现
 * @createDate 2025-03-31 16:48:11
 */
@Service
@RequiredArgsConstructor
public class GradeServiceImpl extends ServiceImpl<GradeMapper, Grade> implements GradeService {

    private final UserMapper userMapper;
    private final GradeMapper gradeMapper;
    private final CourseMapper courseMapper;
    private final CourseEvaluationMapper courseEvaluationMapper;

    @Override
    public Double getGPA(String userId) {
        LambdaQueryWrapper<Grade> gradeLambdaQueryWrapper = new LambdaQueryWrapper<>();
        gradeLambdaQueryWrapper.eq(Grade::getStudentId, userId);
        List<Grade> gradeList = gradeMapper.selectList(gradeLambdaQueryWrapper);
        List<Integer> courseIdList = gradeList.stream().map(Grade::getCourseId).toList();
        LambdaQueryWrapper<Course> courseLambdaQueryWrapper = new LambdaQueryWrapper<>();
        courseLambdaQueryWrapper.in(Course::getCourseId, courseIdList);
        List<Course> courseList = courseMapper.selectList(courseLambdaQueryWrapper);
        // 1. 建立课程学分映射（优化查询）
        Map<Integer, BigDecimal> courseCreditMap = courseList.stream()
                .collect(Collectors.toMap(Course::getCourseId, Course::getCredit));
        // 2. 遍历成绩计算GPA
        double totalPoints = 0.0;
        double totalCredits = 0.0;

        for (Grade grade : gradeList) {
            Double score = grade.getScore();
            BigDecimal credit = courseCreditMap.get(grade.getCourseId());

            // 排除无效成绩和学分
            if (score == null || credit == null || credit.compareTo(BigDecimal.ZERO) <= 0) continue;

            // 分数转绩点（采用国内通用标准）
            double gpaPoint = (score >= 60) ? (score / 10.0 - 5) : 0.0;

            totalPoints += gpaPoint * credit.doubleValue();
            totalCredits += credit.doubleValue();
        }
        // 3. 处理无有效数据情况
        ThrowUtils.throwIf(totalCredits == 0, ErrorCode.PARAMS_ERROR, "无有效成绩数据");
        // 4. 计算最终GPA（保留两位小数）
        return Math.round((totalPoints / totalCredits) * 100) / 100.0;
    }

    @Override
    public IPage<GradeVO> listByPage(GradeQueryRequest gradeQueryRequest, HttpServletRequest request) {
        LambdaQueryWrapper<Grade> wrapper = new LambdaQueryWrapper<>();
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        wrapper.eq(Grade::getStudentId, userVO.getUserId());
        int current = gradeQueryRequest.getCurrent();
        int pageSize = gradeQueryRequest.getPageSize();
        Page<Grade> page = new Page<>(current, pageSize);
        IPage<Grade> gradePage = gradeMapper.selectByPage(page, gradeQueryRequest.getSemester());
        return gradePage.convert(grade -> {
            GradeVO gradeVO = new GradeVO();
            gradeVO.setScore(grade.getScore());
            LambdaQueryWrapper<Course> queryWrapper = new LambdaQueryWrapper<>();
            LambdaQueryWrapper<CourseEvaluation> courseEvaluationWrapper = new LambdaQueryWrapper<>();
            courseEvaluationWrapper.eq(CourseEvaluation::getStudentId, userVO.getUserId());
            courseEvaluationWrapper.eq(CourseEvaluation::getCourseId, grade.getCourseId());
            CourseEvaluation courseEvaluation = courseEvaluationMapper.selectOne(courseEvaluationWrapper);
            gradeVO.setIsComment(!ObjectUtil.isNull(courseEvaluation));
            queryWrapper.eq(Course::getCourseId, grade.getCourseId());
            Course course = courseMapper.selectOne(queryWrapper);
            BeanUtils.copyProperties(course, gradeVO);
            return gradeVO;
        });
    }

    public IPage<UserVO> listStudentByPage(UserQueryRequest queryRequest, Integer courseId) {
        // 1. 初始化分页参数
        Page<User> page = new Page<>(queryRequest.getCurrent(), queryRequest.getPageSize());

        // 2. 执行分页查询
        IPage<User> userPage = userMapper.selectStudentsByCourseId(page, courseId);

        // 3. 转换为VO对象
        return userPage.convert(user -> {
            UserVO vo = new UserVO();
            BeanUtils.copyProperties(user, vo);
            return vo;
        });
    }
}




