package com.shiro.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shiro.campus.model.entity.User;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author ly179
 * @description 针对表【user】的数据库操作Mapper
 * @createDate 2025-03-31 16:48:11
 * @Entity com.shiro.campus.model.entity.User
 */
public interface UserMapper extends BaseMapper<User> {

    void batchAddUsers(List<User> userList);

    // 在UserMapper.java中添加
    @Select("SELECT u.* FROM user u " +
            "INNER JOIN course_selection cs ON u.userId = cs.studentId " +
            "WHERE cs.courseId = #{courseId} AND u.role = 'STUDENT' " +
            "ORDER BY u.userId")
    IPage<User> selectStudentsByCourseId(Page<User> page, @Param("courseId") Integer courseId);
}




