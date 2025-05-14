package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.college.CollegeAddRequest;
import com.shiro.campus.model.dto.college.CollegeQueryRequest;
import com.shiro.campus.model.dto.college.CollegeUpdateRequest;
import com.shiro.campus.model.entity.College;
import com.shiro.campus.service.CollegeService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/college")
public class CollegeController {
    private final CollegeService collegeService;

    public CollegeController(CollegeService collegeService) {
        this.collegeService = collegeService;
    }

    @Operation(summary = "新增学院")
    @PostMapping("/add/single")
    public BaseResponse<Void> addCollege(@Valid @RequestBody CollegeAddRequest collegeAddRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(collegeAddRequest), ErrorCode.PARAMS_ERROR);
        College college = new College();
        BeanUtils.copyProperties(collegeAddRequest, college);
        collegeService.save(college);
        return ResultUtils.success("添加成功！");
    }

    @Operation(summary = "分页获取学院列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<College>> listCollegeByPage(@Valid @RequestBody CollegeQueryRequest collegeQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(collegeQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(collegeService.listCollegeByPage(collegeQueryRequest));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取学院")
    public BaseResponse<College> getCollegeById(@PathVariable String id) {
        College college = collegeService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(college), ErrorCode.PARAMS_ERROR, "学院不存在");
        return ResultUtils.success(college);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除学院")
    public BaseResponse<Void> deleteCollegeById(@PathVariable String id) {
        College college = collegeService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(college), ErrorCode.PARAMS_ERROR, "学院不存在！");
        collegeService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新学院")
    public BaseResponse<Void> updateCollegeById(@RequestBody CollegeUpdateRequest collegeUpdateRequest, @PathVariable String id) {
        ThrowUtils.throwIf(ObjectUtil.isNull(collegeUpdateRequest), ErrorCode.PARAMS_ERROR);
        College college = new College();
        BeanUtils.copyProperties(collegeUpdateRequest, college);
        college.setCollegeId(id);
        collegeService.updateById(college);
        return ResultUtils.success("更新成功!");
    }

    //获取学院列表
    @GetMapping("/list")
    @Operation(summary = "获取学院列表")
    public BaseResponse<List<College>> listCollege() {
        return ResultUtils.success(collegeService.list());
    }
}
