package com.shiro.campus.model.dto.college;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CollegeUpdateRequest {

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
