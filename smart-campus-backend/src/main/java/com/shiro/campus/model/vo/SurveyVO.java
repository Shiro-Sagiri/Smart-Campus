package com.shiro.campus.model.vo;

import com.shiro.campus.model.entity.SurveyQuestion;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SurveyVO {

    private Integer surveyId;

    /**
     * 标题
     */
    private String title;

    /**
     * 描述
     */
    private String description;

    /**
     * 创建人ID
     */
    private String creatorId;

    /**
     * 开始时间
     */
    private LocalDateTime startTime;

    /**
     * 截止时间
     */
    private LocalDateTime endTime;

    private List<SurveyQuestion> questionList;
}
