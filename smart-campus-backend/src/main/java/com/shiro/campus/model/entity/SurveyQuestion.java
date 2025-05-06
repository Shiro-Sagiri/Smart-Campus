package com.shiro.campus.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.shiro.campus.handler.JsonListTypeHandler;
import com.shiro.campus.model.enums.QuestionTypeEnum;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @TableName survey_question
 */
@TableName(value = "survey_question")
@Data
public class SurveyQuestion implements Serializable {
    /**
     * 问题ID
     */
    @TableId(type = IdType.AUTO)
    private Integer questionId;

    /**
     * 问卷ID
     */
    private Integer surveyId;

    /**
     * 问题类型
     */
    private QuestionTypeEnum type;

    /**
     * 题干
     */
    private String content;

    /**
     * 选项列表
     */
    @TableField(typeHandler = JsonListTypeHandler.class)
    private List<String> options;

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
        SurveyQuestion other = (SurveyQuestion) that;
        return (this.getQuestionId() == null ? other.getQuestionId() == null : this.getQuestionId().equals(other.getQuestionId())) && (this.getSurveyId() == null ? other.getSurveyId() == null : this.getSurveyId().equals(other.getSurveyId())) && (this.getType() == null ? other.getType() == null : this.getType().equals(other.getType())) && (this.getContent() == null ? other.getContent() == null : this.getContent().equals(other.getContent())) && (this.getOptions() == null ? other.getOptions() == null : this.getOptions().equals(other.getOptions()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getQuestionId() == null) ? 0 : getQuestionId().hashCode());
        result = prime * result + ((getSurveyId() == null) ? 0 : getSurveyId().hashCode());
        result = prime * result + ((getType() == null) ? 0 : getType().hashCode());
        result = prime * result + ((getContent() == null) ? 0 : getContent().hashCode());
        result = prime * result + ((getOptions() == null) ? 0 : getOptions().hashCode());
        return result;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + " [" + "Hash = " + hashCode() + ", questionId=" + questionId + ", surveyId=" + surveyId + ", type=" + type + ", content=" + content + ", options=" + options + ", serialVersionUID=" + serialVersionUID + "]";
    }
}