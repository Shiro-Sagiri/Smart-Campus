package com.shiro.campus.model.dto.college;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CollegeAddRequest {

    /**
     * 学院id
     */
    @NotNull(message = "学院id不能为空")
    private String collegeId;

    /**
     * 学院名称
     */
    @NotNull(message = "学院名称不能为空")
    private String collegeName;

    /**
     * 学院简介
     */
    private String description;
}
