package com.shiro.campus.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.TimeUtils;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.exception.BusinessException;
import com.shiro.campus.mapper.CourseMapper;
import com.shiro.campus.mapper.CourseSelectionMapper;
import com.shiro.campus.model.dto.course.CourseQueryRequest;
import com.shiro.campus.model.entity.Course;
import com.shiro.campus.model.entity.CourseSelection;
import com.shiro.campus.model.vo.Schedule;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * @author ly179
 */
@Service
@RequiredArgsConstructor
public class CourseServiceImpl extends ServiceImpl<CourseMapper, Course>
        implements CourseService {

    private final CourseMapper courseMapper;
    private final CourseSelectionMapper courseSelectionMapper;


    @Override
    public List<Course> getMyCourseTimetable(String semester, HttpServletRequest request) {
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        LambdaQueryWrapper<CourseSelection> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CourseSelection::getStudentId, userVO.getUserId());
        List<Integer> courseIdList = courseSelectionMapper.selectList(wrapper).stream().map(CourseSelection::getCourseId).toList();
        LambdaQueryWrapper<Course> courseLambdaQueryWrapper = new LambdaQueryWrapper<>();
        courseLambdaQueryWrapper.in(Course::getCourseId, courseIdList);
        if (StrUtil.isNotBlank(semester)) {
            courseLambdaQueryWrapper.eq(Course::getSemester, semester);
        }
        return courseMapper.selectList(courseLambdaQueryWrapper);
    }

    @Override
    public IPage<Course> listMyCourseByPage(CourseQueryRequest courseQueryRequest, HttpServletRequest request) {
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        Page<Course> page = new Page<>(courseQueryRequest.getCurrent(), courseQueryRequest.getPageSize());
        return courseMapper.selectSelectedCourses(page, userVO.getUserId());
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void selectCourse(Integer courseId, String studentId) {
        // 1. 校验基础数据
        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "课程不存在");
        }

        // 2. 检查重复选课
        if (courseSelectionMapper.exists(new QueryWrapper<CourseSelection>()
                .eq("studentId", studentId)
                .eq("courseId", courseId))) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "不可重复选课");
        }

        // 3. 检查容量限制
        if (course.getSelected() >= course.getMaxCapacity()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "课程已满员");
        }

        // 4. 检查时间冲突
        List<Course> selectedCourses = courseMapper.selectCoursesByStudent(studentId);
        boolean hasConflict = selectedCourses.stream()
                .anyMatch(selected -> checkScheduleConflict(selected.getSchedule(), course.getSchedule(),
                        selected.getSemester(), course.getSemester()));
        if (hasConflict) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "课程时间冲突");
        }

        // 5. 执行选课操作
        courseMapper.updateSelectedCount(courseId, 1); // 自定义SQL更新
        CourseSelection courseSelection = new CourseSelection();
        courseSelection.setStudentId(studentId);
        courseSelection.setCourseId(courseId);
        courseSelectionMapper.insert(courseSelection);
    }

    // 时间冲突检测算法
    private boolean checkScheduleConflict(Schedule exist, Schedule current, String oldSemester, String newSemester) {
        boolean isSameSemester = oldSemester.equals(newSemester);
        if (!isSameSemester) {
            return false; // 不同学期无需检测时间冲突
        }
        // 实现周次、星期、节次的三维冲突检测
        return TimeUtils.hasOverlap(exist.getWeeks(), current.getWeeks())
                && TimeUtils.hasIntersection(exist.getWeekdays(), current.getWeekdays())
                && TimeUtils.hasOverlap(exist.getSections(), current.getSections());
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




