package com.shiro.campus.model.dto.course;

import com.baomidou.mybatisplus.annotation.TableField;
import com.shiro.campus.handler.ScheduleTypeHandler;
import com.shiro.campus.model.vo.Schedule;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.apache.ibatis.type.JdbcType;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 *
 */
@Data
public class CourseUpdateRequest implements Serializable {


    /**
     * 课程名称
     */
    @NotNull(message = "课程名称不能为空")
    private String courseName;

    /**
     * 学分
     */
    @NotNull(message = "学分不能为空")
    private BigDecimal credit;

    /**
     * 授课教师ID
     */
    @NotNull(message = "授课教师ID不能为空")
    private String teacherId;

    /**
     * 最大选课人数
     */
    @NotNull(message = "最大选课人数不能为空")
    private Integer maxCapacity;

    private Integer hours;

    private String semester;

    /**
     * 上课时间
     */
    @TableField(typeHandler = ScheduleTypeHandler.class, jdbcType = JdbcType.VARCHAR)
    private Schedule schedule;

    /**
     * 教室地点
     */
    @NotNull(message = "教室地点不能为空")
    private String location;

    @Serial
    private static final long serialVersionUID = 1L;

}