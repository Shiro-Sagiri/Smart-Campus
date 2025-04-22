package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.mapper.SurveyQuestionMapper;
import com.shiro.campus.model.dto.survey.SurveyAddRequest;
import com.shiro.campus.model.dto.survey.SurveyQueryRequest;
import com.shiro.campus.model.dto.survey.SurveyUpdateRequest;
import com.shiro.campus.model.entity.Survey;
import com.shiro.campus.model.entity.SurveyQuestion;
import com.shiro.campus.service.SurveyService;
import com.shiro.campus.mapper.SurveyMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * @author ly179
 */
@Service
public class SurveyServiceImpl extends ServiceImpl<SurveyMapper, Survey>
        implements SurveyService {

    private final SurveyMapper surveyMapper;
    private final SurveyQuestionMapper surveyQuestionMapper;

    public SurveyServiceImpl(SurveyMapper surveyMapper, SurveyQuestionMapper surveyQuestionMapper) {
        this.surveyMapper = surveyMapper;
        this.surveyQuestionMapper = surveyQuestionMapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addSurvey(SurveyAddRequest surveyAddRequest, HttpServletRequest request) {
        List<SurveyQuestion> questionList = surveyAddRequest.getSurveyQuestionList();
        surveyQuestionMapper.insert(questionList);
        Survey survey = new Survey();
        BeanUtils.copyProperties(surveyAddRequest, survey);
        survey.setCreatorId((String) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE));
        surveyMapper.insert(survey);
    }

    @Override
    public IPage<Survey> listSurveyByPage(SurveyQueryRequest surveyQueryRequest) {
        LambdaQueryWrapper<Survey> wrapper = buildQueryWrapper(surveyQueryRequest);
        int current = surveyQueryRequest.getCurrent();
        int pageSize = surveyQueryRequest.getPageSize();
        return surveyMapper.selectPage(new Page<>(current, pageSize), wrapper);
    }

    private LambdaQueryWrapper<Survey> buildQueryWrapper(SurveyQueryRequest request) {
        LambdaQueryWrapper<Survey> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getTitle()).ifPresent(name -> wrapper.like(Survey::getTitle, name));
        return wrapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateSurvey(SurveyUpdateRequest surveyUpdateRequest, Integer id, HttpServletRequest request) {
        List<SurveyQuestion> questionList = surveyUpdateRequest.getSurveyQuestionList();
        surveyQuestionMapper.updateById(questionList);
        Survey survey = new Survey();
        BeanUtils.copyProperties(surveyUpdateRequest, survey);
        survey.setCreatorId((String) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE));
        survey.setSurveyId(id);
        surveyMapper.updateById(survey);
    }
}




