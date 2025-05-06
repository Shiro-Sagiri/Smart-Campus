package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.mapper.SurveyAnswerMapper;
import com.shiro.campus.mapper.SurveyQuestionMapper;
import com.shiro.campus.model.dto.survey.SurveyAddRequest;
import com.shiro.campus.model.dto.survey.SurveyQueryRequest;
import com.shiro.campus.model.dto.survey.SurveyUpdateRequest;
import com.shiro.campus.model.entity.Survey;
import com.shiro.campus.model.entity.SurveyAnswer;
import com.shiro.campus.model.entity.SurveyQuestion;
import com.shiro.campus.model.vo.SurveyVO;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.SurveyService;
import com.shiro.campus.mapper.SurveyMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author ly179
 */
@Service
public class SurveyServiceImpl extends ServiceImpl<SurveyMapper, Survey>
        implements SurveyService {

    private final SurveyMapper surveyMapper;
    private final SurveyQuestionMapper surveyQuestionMapper;
    private final SurveyAnswerMapper surveyAnswerMapper;

    public SurveyServiceImpl(SurveyMapper surveyMapper, SurveyQuestionMapper surveyQuestionMapper, SurveyAnswerMapper surveyAnswerMapper) {
        this.surveyMapper = surveyMapper;
        this.surveyQuestionMapper = surveyQuestionMapper;
        this.surveyAnswerMapper = surveyAnswerMapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addSurvey(SurveyAddRequest surveyAddRequest, HttpServletRequest request) {
        Survey survey = new Survey();
        BeanUtils.copyProperties(surveyAddRequest, survey);
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        survey.setCreatorId(userVO.getUserId());
        surveyMapper.insert(survey);
        List<SurveyQuestion> questionList = surveyAddRequest.getSurveyQuestionList();
        Integer surveyId = survey.getSurveyId();
        questionList.forEach(item -> item.setSurveyId(surveyId));
        surveyQuestionMapper.insert(questionList);
    }

    @Override
    public IPage<SurveyVO> listSurveyByPage(SurveyQueryRequest surveyQueryRequest) {
        LambdaQueryWrapper<Survey> wrapper = buildQueryWrapper(surveyQueryRequest);
        return getSurveyVOIPage(surveyQueryRequest, wrapper);
    }

    private LambdaQueryWrapper<Survey> buildQueryWrapper(SurveyQueryRequest request) {
        LambdaQueryWrapper<Survey> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getTitle()).ifPresent(name -> wrapper.like(Survey::getTitle, name));
        return wrapper;
    }

    @Override
    public IPage<SurveyVO> listUserSurveyByPage(SurveyQueryRequest surveyQueryRequest, HttpServletRequest request) {
        LambdaQueryWrapper<SurveyAnswer> w = new LambdaQueryWrapper<>();
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        w.eq(SurveyAnswer::getUserId, userVO.getUserId());
        List<SurveyAnswer> surveyAnswerList = surveyAnswerMapper.selectList(w);
        Set<Integer> surveyIdList = surveyAnswerList.stream().map(SurveyAnswer::getSurveyId).collect(Collectors.toSet());
        LambdaQueryWrapper<Survey> wrapper = buildQueryWrapper(surveyQueryRequest);
        wrapper.notIn(!surveyIdList.isEmpty(), Survey::getSurveyId, surveyIdList);
        return getSurveyVOIPage(surveyQueryRequest, wrapper);
    }

    @NotNull
    private IPage<SurveyVO> getSurveyVOIPage(SurveyQueryRequest surveyQueryRequest, LambdaQueryWrapper<Survey> wrapper) {
        int current = surveyQueryRequest.getCurrent();
        int pageSize = surveyQueryRequest.getPageSize();
        IPage<Survey> surveyPage = surveyMapper.selectPage(new Page<>(current, pageSize), wrapper);
        IPage<SurveyVO> surveyVOPage = new Page<>(current, pageSize);
        List<Survey> records = surveyPage.getRecords();
        List<SurveyVO> surveyVOList = records.stream().map(item -> {
            LambdaQueryWrapper<SurveyQuestion> w = new LambdaQueryWrapper<>();
            w.eq(SurveyQuestion::getSurveyId, item.getSurveyId());
            SurveyVO surveyVO = new SurveyVO();
            BeanUtils.copyProperties(item, surveyVO);
            surveyVO.setQuestionList(surveyQuestionMapper.selectList(w));
            return surveyVO;
        }).toList();
        surveyVOPage.setRecords(surveyVOList);
        surveyVOPage.setTotal(surveyPage.getTotal());
        return surveyVOPage;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateSurvey(SurveyUpdateRequest surveyUpdateRequest, Integer id, HttpServletRequest request) {
        //删除原有的问卷问题
        LambdaQueryWrapper<SurveyQuestion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SurveyQuestion::getSurveyId, id);
        surveyQuestionMapper.delete(wrapper);
        //添加新的问卷问题
        List<SurveyQuestion> questionList = surveyUpdateRequest.getSurveyQuestionList();
        questionList.forEach(item -> item.setSurveyId(id));
        surveyQuestionMapper.insert(questionList);
        //更新问卷
        Survey survey = new Survey();
        BeanUtils.copyProperties(surveyUpdateRequest, survey);
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        survey.setCreatorId(userVO.getUserId());
        survey.setSurveyId(id);
        surveyMapper.updateById(survey);
    }
}




