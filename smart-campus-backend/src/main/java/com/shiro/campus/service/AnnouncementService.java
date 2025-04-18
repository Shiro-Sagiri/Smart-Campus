package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shiro.campus.model.dto.announcement.AnnouncementQueryRequest;
import com.shiro.campus.model.entity.Announcement;
import jakarta.validation.Valid;

/**
* @author ly179
* @description 针对表【announcement】的数据库操作Service
* @createDate 2025-03-31 16:48:10
*/
public interface AnnouncementService extends IService<Announcement> {
    IPage<Announcement> listAnnouncementByPage(@Valid AnnouncementQueryRequest announcementQueryRequest);
}
