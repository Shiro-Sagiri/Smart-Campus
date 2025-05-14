package com.shiro.campus.model.dto.major;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MajorAddRequest {

    /**
     * 专业id
     */
    @NotNull(message = "专业id不能为空")
    private String majorId;

    /**
     * 专业名称
     */
    @NotNull(message = "专业名称不能为空")
    private String majorName;

    /**
     * 所属学院
     */
    @NotNull(message = "所属学院不能为空")
    private String collegeId;

    /**
     * 专业简介
     */
    private String description;
}
