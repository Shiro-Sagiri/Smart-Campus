package com.shiro.campus.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.shiro.campus.model.enums.CourseSelectionStatusEnum;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 
 * @TableName course_selection
 */
@TableName(value ="course_selection")
@Data
public class CourseSelection implements Serializable {
    /**
     * 选课记录ID
     */
    @TableId(type = IdType.AUTO)
    private Integer selectionId;

    /**
     * 学生ID
     */
    private String studentId;

    /**
     * 课程ID
     */
    private Integer courseId;

    /**
     * 状态
     */
    private CourseSelectionStatusEnum status;

    /**
     * 操作时间
     */
    private LocalDateTime operationTime;

    /**
     * 逻辑删除标记
     */
    @TableLogic
    private Integer isDeleted;

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        CourseSelection other = (CourseSelection) that;
        return (this.getSelectionId() == null ? other.getSelectionId() == null : this.getSelectionId().equals(other.getSelectionId()))
            && (this.getStudentId() == null ? other.getStudentId() == null : this.getStudentId().equals(other.getStudentId()))
            && (this.getCourseId() == null ? other.getCourseId() == null : this.getCourseId().equals(other.getCourseId()))
            && (this.getStatus() == null ? other.getStatus() == null : this.getStatus().equals(other.getStatus()))
            && (this.getOperationTime() == null ? other.getOperationTime() == null : this.getOperationTime().equals(other.getOperationTime()))
            && (this.getIsDeleted() == null ? other.getIsDeleted() == null : this.getIsDeleted().equals(other.getIsDeleted()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getSelectionId() == null) ? 0 : getSelectionId().hashCode());
        result = prime * result + ((getStudentId() == null) ? 0 : getStudentId().hashCode());
        result = prime * result + ((getCourseId() == null) ? 0 : getCourseId().hashCode());
        result = prime * result + ((getStatus() == null) ? 0 : getStatus().hashCode());
        result = prime * result + ((getOperationTime() == null) ? 0 : getOperationTime().hashCode());
        result = prime * result + ((getIsDeleted() == null) ? 0 : getIsDeleted().hashCode());
        return result;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() +
                " [" +
                "Hash = " + hashCode() +
                ", selectionId=" + selectionId +
                ", studentId=" + studentId +
                ", courseId=" + courseId +
                ", status=" + status +
                ", operationTime=" + operationTime +
                ", isDeleted=" + isDeleted +
                ", serialVersionUID=" + serialVersionUID +
                "]";
    }
}