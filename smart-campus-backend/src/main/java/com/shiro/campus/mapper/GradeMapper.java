package com.shiro.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shiro.campus.model.entity.Grade;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * @author ly179
 * @description 针对表【grade】的数据库操作Mapper
 * @createDate 2025-03-31 16:48:11
 * @Entity com.shiro.campus.model.entity.Grade
 */
public interface GradeMapper extends BaseMapper<Grade> {

    @Select("<script>" +
            "SELECT g.* FROM Grade g " +
            "INNER JOIN course c ON g.courseId = c.courseId " +
            "<where>" +
            "  <if test='semester != null'>" +
            "    c.semester = #{semester}" +
            "  </if>" +
            "</where>" +
            "</script>")
    IPage<Grade> selectByPage(Page<Grade> page, @Param("semester") String semester);
}




