package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.CosUtils;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.exception.ThrowUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/file")
public class FileController {

    private final CosUtils cosUtils;

    public FileController(CosUtils cosUtils) {
        this.cosUtils = cosUtils;
    }

    @PostMapping("/upload")
    @CrossOrigin
    public BaseResponse<String> uploadFile(@RequestParam("file") MultipartFile file) {
        ThrowUtils.throwIf(ObjectUtil.isNull(file), ErrorCode.PARAMS_ERROR, "文件为空！");
        return ResultUtils.success(cosUtils.uploadFile(file), "上传成功！");
    }
}
