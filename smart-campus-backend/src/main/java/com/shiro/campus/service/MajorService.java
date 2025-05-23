package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shiro.campus.model.dto.major.MajorQueryRequest;
import com.shiro.campus.model.entity.Major;
import jakarta.validation.Valid;

/**
* @author ly179
* @description 针对表【major】的数据库操作Service
* @createDate 2025-05-08 22:44:21
*/
public interface MajorService extends IService<Major> {

    IPage<Major> listMajorByPage(@Valid MajorQueryRequest majorQueryRequest);
}
