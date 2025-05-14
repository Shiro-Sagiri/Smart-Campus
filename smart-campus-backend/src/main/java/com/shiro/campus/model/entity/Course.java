package com.shiro.campus.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.shiro.campus.handler.ScheduleTypeHandler;
import com.shiro.campus.model.vo.Schedule;
import lombok.Data;
import org.apache.ibatis.type.JdbcType;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @TableName course
 */
@TableName(value = "course")
@Data
public class Course implements Serializable {
    /**
     * 课程ID
     */
    @TableId(type = IdType.AUTO)
    private Integer courseId;

    /**
     * 课程名称
     */
    private String courseName;

    /**
     * 学期（格式：YYYY-YYYY-1/2，如2023-2024-1）
     */
    private String semester;

    /**
     * 学分
     */
    private BigDecimal credit;

    /**
     * 授课教师ID
     */
    private String teacherId;

    /**
     * 最大选课人数
     */
    private Integer maxCapacity;
    private Integer selected;

    /**
     * 总学时
     */
    private Integer hours;

    /**
     * 时间安排（JSON结构）
     */
    @TableField(typeHandler = ScheduleTypeHandler.class, jdbcType = JdbcType.VARCHAR)
    private Schedule schedule;

    /**
     * 教室地点
     */
    private String location;

    /**
     * 逻辑删除标记
     */
    private Integer isDeleted;

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}