package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.mapper.MajorMapper;
import com.shiro.campus.model.dto.major.MajorQueryRequest;
import com.shiro.campus.model.entity.Major;
import com.shiro.campus.service.MajorService;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author ly179
 */
@Service
public class MajorServiceImpl extends ServiceImpl<MajorMapper, Major>
        implements MajorService {

    private final MajorMapper majorMapper;

    public MajorServiceImpl(MajorMapper majorMapper) {
        this.majorMapper = majorMapper;
    }

    @Override
    public IPage<Major> listMajorByPage(MajorQueryRequest majorQueryRequest) {
        LambdaQueryWrapper<Major> wrapper = buildQueryWrapper(majorQueryRequest);
        int current = majorQueryRequest.getCurrent();
        int pageSize = majorQueryRequest.getPageSize();
        return majorMapper.selectPage(new Page<>(current, pageSize), wrapper);
    }

    private LambdaQueryWrapper<Major> buildQueryWrapper(MajorQueryRequest request) {
        LambdaQueryWrapper<Major> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getMajorName()).ifPresent(name -> wrapper.like(Major::getMajorName, name));
        Optional.ofNullable(request.getMajorId()).ifPresent(id -> wrapper.eq(Major::getMajorId, id));
        Optional.ofNullable(request.getCollegeId()).ifPresent(id -> wrapper.eq(Major::getCollegeId, id));
        return wrapper;
    }
}




