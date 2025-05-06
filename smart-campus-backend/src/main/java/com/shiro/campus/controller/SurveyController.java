package com.shiro.campus.controller;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.survey.SurveyAddRequest;
import com.shiro.campus.model.dto.survey.SurveyQueryRequest;
import com.shiro.campus.model.dto.survey.SurveyUpdateRequest;
import com.shiro.campus.model.entity.Survey;
import com.shiro.campus.model.entity.SurveyAnswer;
import com.shiro.campus.model.entity.SurveyQuestion;
import com.shiro.campus.model.vo.SurveyVO;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.SurveyAnswerService;
import com.shiro.campus.service.SurveyQuestionService;
import com.shiro.campus.service.SurveyService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/survey")
public class SurveyController {

    private final SurveyService surveyService;
    private final SurveyQuestionService surveyQuestionService;
    private final SurveyAnswerService surveyAnswerService;

    public SurveyController(SurveyService surveyService, SurveyQuestionService surveyQuestionService, SurveyAnswerService surveyAnswerService) {
        this.surveyService = surveyService;
        this.surveyQuestionService = surveyQuestionService;
        this.surveyAnswerService = surveyAnswerService;
    }

    @Operation(summary = "新增问卷")
    @PostMapping("/add/single")
    public BaseResponse<Void> addSurvey(@Valid @RequestBody SurveyAddRequest surveyAddRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(surveyAddRequest), ErrorCode.PARAMS_ERROR);
        surveyService.addSurvey(surveyAddRequest, request);
        return ResultUtils.success("添加成功！");
    }

    @Operation(summary = "分页获取问卷列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<SurveyVO>> listSurveyByPage(@Valid @RequestBody SurveyQueryRequest surveyQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(surveyQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(surveyService.listSurveyByPage(surveyQueryRequest));
    }

    @Operation(summary = "分页获取用户未填问卷列表")
    @PostMapping("/page/list/user")
    public BaseResponse<IPage<SurveyVO>> listUserSurveyByPage(@Valid @RequestBody SurveyQueryRequest surveyQueryRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(surveyQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(surveyService.listUserSurveyByPage(surveyQueryRequest, request));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取问卷")
    public BaseResponse<SurveyVO> getSurveyVOById(@PathVariable String id) {
        Survey survey = surveyService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(survey), ErrorCode.PARAMS_ERROR, "问卷不存在");
        SurveyVO surveyVO = new SurveyVO();
        BeanUtils.copyProperties(survey, surveyVO);
        LambdaQueryWrapper<SurveyQuestion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SurveyQuestion::getSurveyId, id);
        List<SurveyQuestion> questionList = surveyQuestionService.list(wrapper);
        surveyVO.setQuestionList(questionList);
        return ResultUtils.success(surveyVO);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除问卷")
    public BaseResponse<Void> deleteSurveyById(@PathVariable String id) {
        Survey survey = surveyService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(survey), ErrorCode.PARAMS_ERROR, "问卷不存在！");
        surveyService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新问卷")
    public BaseResponse<Void> updateSurveyById(@RequestBody SurveyUpdateRequest surveyUpdateRequest, @PathVariable Integer id, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(surveyUpdateRequest), ErrorCode.PARAMS_ERROR);
        surveyService.updateSurvey(surveyUpdateRequest, id, request);
        return ResultUtils.success("更新成功!");
    }

    @PostMapping("/answer/{surveyId}")
    @Operation(summary = "提交问卷答案")
    @Transactional(rollbackFor = Exception.class)
    public BaseResponse<Void> submitSurveyAnswer(@RequestBody List<SurveyAnswer> surveyAnswerList, HttpServletRequest request, @PathVariable Integer surveyId) {
        ThrowUtils.throwIf(CollUtil.isEmpty(surveyAnswerList), ErrorCode.PARAMS_ERROR);
        UserVO userVO = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        surveyAnswerList.forEach(item -> {
            item.setSurveyId(surveyId);
            item.setUserId(userVO.getUserId());
        });
        surveyAnswerService.saveBatch(surveyAnswerList);
        return ResultUtils.success("提交成功！");
    }

    @GetMapping("/answer/{surveyId}")
    @Operation(summary = "获取问卷答案")
    public BaseResponse<List<SurveyAnswer>> getSurveyAnswer(@PathVariable Integer surveyId) {
        LambdaQueryWrapper<SurveyAnswer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SurveyAnswer::getSurveyId, surveyId);
        List<SurveyAnswer> surveyAnswerList = surveyAnswerService.list(wrapper);
        return ResultUtils.success(surveyAnswerList);
    }

    //分页获取文本题答案
    @Operation(summary = "分页获取文本题答案")
    @PostMapping("/page/text/answer/{surveyId}")
    public BaseResponse<IPage<SurveyAnswer>> getTextAnswer(@RequestBody SurveyQueryRequest surveyQueryRequest, @PathVariable Integer surveyId) {
        ThrowUtils.throwIf(ObjectUtil.isNull(surveyQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(surveyAnswerService.getTextAnswer(surveyQueryRequest, surveyId));
    }
}
