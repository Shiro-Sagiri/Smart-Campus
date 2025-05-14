package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.mapper.ClassMapper;
import com.shiro.campus.model.dto.classDTO.ClassQueryRequest;
import com.shiro.campus.model.entity.Class;
import com.shiro.campus.service.ClassService;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author ly179
 */
@Service
public class ClassServiceImpl extends ServiceImpl<ClassMapper, Class>
        implements ClassService {

    private final ClassMapper classMapper;

    public ClassServiceImpl(ClassMapper classMapper) {
        this.classMapper = classMapper;
    }

    @Override
    public IPage<Class> listClassByPage(ClassQueryRequest classQueryRequest) {
        LambdaQueryWrapper<Class> wrapper = buildQueryWrapper(classQueryRequest);
        int current = classQueryRequest.getCurrent();
        int pageSize = classQueryRequest.getPageSize();
        return classMapper.selectPage(new Page<>(current, pageSize), wrapper);
    }

    private LambdaQueryWrapper<Class> buildQueryWrapper(ClassQueryRequest request) {
        LambdaQueryWrapper<Class> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getMajorId()).ifPresent(name -> wrapper.eq(Class::getMajorId, name));
        Optional.ofNullable(request.getHeadTeacherId()).ifPresent(id -> wrapper.eq(Class::getHeadTeacherId, id));
        return wrapper;
    }
}




