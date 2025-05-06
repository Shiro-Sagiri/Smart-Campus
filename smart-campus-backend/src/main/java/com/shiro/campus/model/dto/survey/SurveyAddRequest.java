package com.shiro.campus.model.dto.survey;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.shiro.campus.model.entity.SurveyQuestion;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SurveyAddRequest {

    @NotNull(message = "标题不能为空！")
    private String title;

    private String description;

    @NotNull(message = "开始时间不能为空！")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime startTime;

    @NotNull(message = "结束时间不能为空！")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime endTime;

    @NotNull(message = "问题列表不能为空！")
    private List<SurveyQuestion> surveyQuestionList;
}
