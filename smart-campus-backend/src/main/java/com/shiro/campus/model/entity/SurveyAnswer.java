package com.shiro.campus.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 
 * @TableName survey_answer
 */
@TableName(value ="survey_answer")
@Data
public class SurveyAnswer implements Serializable {
    /**
     * 回答ID
     */
    @TableId(type = IdType.AUTO)
    private Integer answerId;

    /**
     * 问卷ID
     */
    private Integer surveyId;

    /**
     * 问题ID
     */
    private Integer questionId;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 回答内容
     */
    private String answer;

    /**
     * 提交时间
     */
    private LocalDateTime submitTime;

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
        SurveyAnswer other = (SurveyAnswer) that;
        return (this.getAnswerId() == null ? other.getAnswerId() == null : this.getAnswerId().equals(other.getAnswerId()))
            && (this.getSurveyId() == null ? other.getSurveyId() == null : this.getSurveyId().equals(other.getSurveyId()))
            && (this.getQuestionId() == null ? other.getQuestionId() == null : this.getQuestionId().equals(other.getQuestionId()))
            && (this.getUserId() == null ? other.getUserId() == null : this.getUserId().equals(other.getUserId()))
            && (this.getAnswer() == null ? other.getAnswer() == null : this.getAnswer().equals(other.getAnswer()))
            && (this.getSubmitTime() == null ? other.getSubmitTime() == null : this.getSubmitTime().equals(other.getSubmitTime()))
            && (this.getIsDeleted() == null ? other.getIsDeleted() == null : this.getIsDeleted().equals(other.getIsDeleted()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getAnswerId() == null) ? 0 : getAnswerId().hashCode());
        result = prime * result + ((getSurveyId() == null) ? 0 : getSurveyId().hashCode());
        result = prime * result + ((getQuestionId() == null) ? 0 : getQuestionId().hashCode());
        result = prime * result + ((getUserId() == null) ? 0 : getUserId().hashCode());
        result = prime * result + ((getAnswer() == null) ? 0 : getAnswer().hashCode());
        result = prime * result + ((getSubmitTime() == null) ? 0 : getSubmitTime().hashCode());
        result = prime * result + ((getIsDeleted() == null) ? 0 : getIsDeleted().hashCode());
        return result;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() +
                " [" +
                "Hash = " + hashCode() +
                ", answerId=" + answerId +
                ", surveyId=" + surveyId +
                ", questionId=" + questionId +
                ", userId=" + userId +
                ", answer=" + answer +
                ", submitTime=" + submitTime +
                ", isDeleted=" + isDeleted +
                ", serialVersionUID=" + serialVersionUID +
                "]";
    }
}