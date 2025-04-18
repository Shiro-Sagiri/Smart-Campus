package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.announcement.AnnouncementAddRequest;
import com.shiro.campus.model.dto.announcement.AnnouncementQueryRequest;
import com.shiro.campus.model.dto.announcement.AnnouncementUpdateRequest;
import com.shiro.campus.model.entity.Announcement;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/announcement")
public class AnnouncementController {
    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @Operation(summary = "新增公告")
    @PostMapping("/add/single")
    public BaseResponse<Void> addAnnouncement(@Valid @RequestBody AnnouncementAddRequest announcementAddRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(announcementAddRequest), ErrorCode.PARAMS_ERROR);
        Announcement announcement = new Announcement();
        BeanUtils.copyProperties(announcementAddRequest, announcement);
        UserVO loginUser = (UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        announcement.setPublisherId(loginUser.getUserId());
        announcementService.save(announcement);
        return ResultUtils.success("添加成功！");
    }

    @Operation(summary = "分页获取公告列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<Announcement>> listAnnouncementByPage(@Valid @RequestBody AnnouncementQueryRequest announcementQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(announcementQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(announcementService.listAnnouncementByPage(announcementQueryRequest));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取公告")
    public BaseResponse<Announcement> getAnnouncementById(@PathVariable String id) {
        Announcement announcement = announcementService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(announcement), ErrorCode.PARAMS_ERROR, "公告不存在");
        return ResultUtils.success(announcement);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除公告")
    public BaseResponse<Void> deleteAnnouncementById(@PathVariable String id) {
        Announcement announcement = announcementService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(announcement), ErrorCode.PARAMS_ERROR, "公告不存在！");
        announcementService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新公告")
    public BaseResponse<Void> updateAnnouncementById(@RequestBody AnnouncementUpdateRequest announcementUpdateRequest, @PathVariable Integer id) {
        ThrowUtils.throwIf(ObjectUtil.isNull(announcementUpdateRequest), ErrorCode.PARAMS_ERROR);
        Announcement announcement = new Announcement();
        BeanUtils.copyProperties(announcementUpdateRequest, announcement);
        announcement.setAnnouncementId(id);
        announcementService.updateById(announcement);
        return ResultUtils.success("更新成功!");
    }
}
