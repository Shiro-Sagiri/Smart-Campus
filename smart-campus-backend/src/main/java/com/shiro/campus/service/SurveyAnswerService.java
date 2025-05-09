package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.model.dto.survey.SurveyQueryRequest;
import com.shiro.campus.model.entity.SurveyAnswer;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author ly179
* @description 针对表【survey_answer】的数据库操作Service
* @createDate 2025-03-31 16:48:11
*/
public interface SurveyAnswerService extends IService<SurveyAnswer> {

    IPage<SurveyAnswer> getTextAnswer(SurveyQueryRequest surveyQueryRequest,Integer surveyId);
}
