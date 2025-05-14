package com.shiro.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shiro.campus.model.entity.Course;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * @author ly179
 * @description 针对表【course】的数据库操作Mapper
 * @createDate 2025-03-31 16:48:11
 * @Entity com.shiro.campus.model.entity.Course
 */
public interface CourseMapper extends BaseMapper<Course> {
    // 更新已选人数（乐观锁）
    @Update("UPDATE course SET selected = selected + #{increment} " +
            "WHERE courseId = #{courseId} AND selected + #{increment} <= maxCapacity")
    int updateSelectedCount(@Param("courseId") Integer courseId,
                            @Param("increment") Integer increment);

    // 查询学生已选课程（包含时间安排）
    @Select("SELECT c.* FROM course c " +
            "JOIN course_selection cs ON c.courseId = cs.courseId " +
            "WHERE cs.studentId = #{studentId}")
    List<Course> selectCoursesByStudent(String studentId);

    @Select("SELECT c.* FROM course c " +
            "JOIN course_selection cs ON c.courseId = cs.courseId " +
            "WHERE cs.studentId = #{userId}")
    IPage<Course> selectSelectedCourses(Page<Course> page, @Param("userId") String userId);
}




