package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.classDTO.ClassAddRequest;
import com.shiro.campus.model.dto.classDTO.ClassQueryRequest;
import com.shiro.campus.model.dto.classDTO.ClassUpdateRequest;
import com.shiro.campus.model.entity.Class;
import com.shiro.campus.service.ClassService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/class")
public class ClassController {
    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    @Operation(summary = "新增班级")
    @PostMapping("/add/single")
    public BaseResponse<Void> addClass(@Valid @RequestBody ClassAddRequest classAddRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(classAddRequest), ErrorCode.PARAMS_ERROR);
        Class c = new Class();
        BeanUtils.copyProperties(classAddRequest, c);
        classService.save(c);
        return ResultUtils.success("添加成功！");
    }

    @Operation(summary = "分页获取班级列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<Class>> listClassByPage(@Valid @RequestBody ClassQueryRequest classQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(classQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(classService.listClassByPage(classQueryRequest));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取班级")
    public BaseResponse<Class> getClassById(@PathVariable String id) {
        Class c = classService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(c), ErrorCode.PARAMS_ERROR, "班级不存在");
        return ResultUtils.success(c);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除班级")
    public BaseResponse<Void> deleteClassById(@PathVariable String id) {
        Class c = classService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(c), ErrorCode.PARAMS_ERROR, "班级不存在！");
        classService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新班级")
    public BaseResponse<Void> updateClassById(@RequestBody ClassUpdateRequest classUpdateRequest, @PathVariable String id) {
        ThrowUtils.throwIf(ObjectUtil.isNull(classUpdateRequest), ErrorCode.PARAMS_ERROR);
        Class c = new Class();
        BeanUtils.copyProperties(classUpdateRequest, c);
        c.setClassId(id);
        classService.updateById(c);
        return ResultUtils.success("更新成功!");
    }

    //获取班级列表
    @GetMapping("/list")
    @Operation(summary = "获取班级列表")
    public BaseResponse<List<Class>> listClass() {
        return ResultUtils.success(classService.list());
    }
}
