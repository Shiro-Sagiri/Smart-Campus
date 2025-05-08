package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.mapper.CollegeMapper;
import com.shiro.campus.model.entity.College;
import com.shiro.campus.service.CollegeService;
import org.springframework.stereotype.Service;

/**
* @author ly179
* @description 针对表【college】的数据库操作Service实现
* @createDate 2025-05-08 22:44:21
*/
@Service
public class CollegeServiceImpl extends ServiceImpl<CollegeMapper, College>
    implements CollegeService{

}




