package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.mapper.CollegeMapper;
import com.shiro.campus.model.dto.college.CollegeQueryRequest;
import com.shiro.campus.model.entity.College;
import com.shiro.campus.service.CollegeService;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author ly179
 */
@Service
public class CollegeServiceImpl extends ServiceImpl<CollegeMapper, College>
        implements CollegeService {

    private final CollegeMapper collegeMapper;

    public CollegeServiceImpl(CollegeMapper collegeMapper) {
        this.collegeMapper = collegeMapper;
    }

    @Override
    public IPage<College> listCollegeByPage(CollegeQueryRequest collegeQueryRequest) {
        LambdaQueryWrapper<College> wrapper = buildQueryWrapper(collegeQueryRequest);
        int current = collegeQueryRequest.getCurrent();
        int pageSize = collegeQueryRequest.getPageSize();
        return collegeMapper.selectPage(new Page<>(current, pageSize), wrapper);
    }

    private LambdaQueryWrapper<College> buildQueryWrapper(CollegeQueryRequest request) {
        LambdaQueryWrapper<College> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getCollegeName()).ifPresent(name -> wrapper.like(College::getCollegeName, name));
        Optional.ofNullable(request.getCollegeId()).ifPresent(id -> wrapper.eq(College::getCollegeId, id));
        return wrapper;
    }
}




