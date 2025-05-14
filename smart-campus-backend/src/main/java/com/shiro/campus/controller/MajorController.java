package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.major.MajorAddRequest;
import com.shiro.campus.model.dto.major.MajorQueryRequest;
import com.shiro.campus.model.dto.major.MajorUpdateRequest;
import com.shiro.campus.model.entity.Major;
import com.shiro.campus.service.MajorService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/major")
public class MajorController {
    private final MajorService majorService;

    public MajorController(MajorService majorService) {
        this.majorService = majorService;
    }

    @Operation(summary = "新增专业")
    @PostMapping("/add/single")
    public BaseResponse<Void> addMajor(@Valid @RequestBody MajorAddRequest majorAddRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(majorAddRequest), ErrorCode.PARAMS_ERROR);
        Major major = new Major();
        BeanUtils.copyProperties(majorAddRequest, major);
        majorService.save(major);
        return ResultUtils.success("添加成功！");
    }

    @Operation(summary = "分页获取专业列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<Major>> listMajorByPage(@Valid @RequestBody MajorQueryRequest majorQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(majorQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(majorService.listMajorByPage(majorQueryRequest));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取专业")
    public BaseResponse<Major> getMajorById(@PathVariable String id) {
        Major major = majorService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(major), ErrorCode.PARAMS_ERROR, "专业不存在");
        return ResultUtils.success(major);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除专业")
    public BaseResponse<Void> deleteMajorById(@PathVariable String id) {
        Major major = majorService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(major), ErrorCode.PARAMS_ERROR, "专业不存在！");
        majorService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新专业")
    public BaseResponse<Void> updateMajorById(@RequestBody MajorUpdateRequest majorUpdateRequest, @PathVariable String id) {
        ThrowUtils.throwIf(ObjectUtil.isNull(majorUpdateRequest), ErrorCode.PARAMS_ERROR);
        Major major = new Major();
        BeanUtils.copyProperties(majorUpdateRequest, major);
        major.setMajorId(id);
        majorService.updateById(major);
        return ResultUtils.success("更新成功!");
    }

    //获取专业列表
    @GetMapping("/list")
    @Operation(summary = "获取专业列表")
    public BaseResponse<List<Major>> listMajor() {
        return ResultUtils.success(majorService.list());
    }
}
