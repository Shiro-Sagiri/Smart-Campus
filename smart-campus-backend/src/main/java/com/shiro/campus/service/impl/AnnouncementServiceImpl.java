package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.mapper.AnnouncementMapper;
import com.shiro.campus.model.dto.announcement.AnnouncementQueryRequest;
import com.shiro.campus.model.entity.Announcement;
import com.shiro.campus.service.AnnouncementService;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author ly179
 */
@Service
public class AnnouncementServiceImpl extends ServiceImpl<AnnouncementMapper, Announcement>
        implements AnnouncementService {

    private final AnnouncementMapper announcementMapper;

    public AnnouncementServiceImpl(AnnouncementMapper announcementMapper) {
        this.announcementMapper = announcementMapper;
    }

    @Override
    public IPage<Announcement> listAnnouncementByPage(AnnouncementQueryRequest announcementQueryRequest) {
        LambdaQueryWrapper<Announcement> wrapper = buildQueryWrapper(announcementQueryRequest);
        int current = announcementQueryRequest.getCurrent();
        int pageSize = announcementQueryRequest.getPageSize();
        return announcementMapper.selectPage(new Page<>(current, pageSize), wrapper);
    }

    private LambdaQueryWrapper<Announcement> buildQueryWrapper(AnnouncementQueryRequest request) {
        LambdaQueryWrapper<Announcement> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getTitle()).ifPresent(name -> wrapper.like(Announcement::getTitle, name));
        Optional.ofNullable(request.getTarget()).ifPresent(role -> wrapper.eq(Announcement::getTarget, role));
        return wrapper;
    }
}




