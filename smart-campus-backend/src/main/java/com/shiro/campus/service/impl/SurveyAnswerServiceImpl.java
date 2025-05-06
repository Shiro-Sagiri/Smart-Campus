package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.mapper.SurveyAnswerMapper;
import com.shiro.campus.model.dto.survey.SurveyQueryRequest;
import com.shiro.campus.model.entity.SurveyAnswer;
import com.shiro.campus.model.enums.QuestionTypeEnum;
import com.shiro.campus.service.SurveyAnswerService;
import org.springframework.stereotype.Service;

/**
 * @author ly179
 * @description 针对表【survey_answer】的数据库操作Service实现
 * @createDate 2025-03-31 16:48:11
 */
@Service
public class SurveyAnswerServiceImpl extends ServiceImpl<SurveyAnswerMapper, SurveyAnswer> implements SurveyAnswerService {

    private final SurveyAnswerMapper surveyAnswerMapper;

    public SurveyAnswerServiceImpl(SurveyAnswerMapper surveyAnswerMapper) {
        this.surveyAnswerMapper = surveyAnswerMapper;
    }

    @Override
    public IPage<SurveyAnswer> getTextAnswer(SurveyQueryRequest surveyQueryRequest, Integer surveyId) {
        LambdaQueryWrapper<SurveyAnswer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SurveyAnswer::getSurveyId, surveyId);
        wrapper.eq(SurveyAnswer::getType, QuestionTypeEnum.TEXT);
        return surveyAnswerMapper.selectPage(new Page<>(surveyQueryRequest.getCurrent(), surveyQueryRequest.getPageSize()), wrapper);
    }
}




