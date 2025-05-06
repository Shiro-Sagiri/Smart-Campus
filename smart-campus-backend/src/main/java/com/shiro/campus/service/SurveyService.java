package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.model.dto.survey.SurveyAddRequest;
import com.shiro.campus.model.dto.survey.SurveyQueryRequest;
import com.shiro.campus.model.dto.survey.SurveyUpdateRequest;
import com.shiro.campus.model.entity.Survey;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shiro.campus.model.vo.SurveyVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
* @author ly179
*/
public interface SurveyService extends IService<Survey> {

    void addSurvey(@Valid SurveyAddRequest surveyAddRequest, HttpServletRequest request);

    IPage<SurveyVO> listSurveyByPage(@Valid SurveyQueryRequest surveyQueryRequest);

    void updateSurvey(SurveyUpdateRequest surveyUpdateRequest, Integer id, HttpServletRequest request);

    IPage<SurveyVO> listUserSurveyByPage(@Valid SurveyQueryRequest surveyQueryRequest, HttpServletRequest request);
}
