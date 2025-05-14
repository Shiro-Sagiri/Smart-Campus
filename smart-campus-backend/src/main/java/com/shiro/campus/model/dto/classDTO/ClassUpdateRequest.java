package com.shiro.campus.model.dto.classDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassUpdateRequest {

    /**
     * 所属专业
     */
    @NotNull(message = "所属专业不能为空")
    private String majorId;

    /**
     * 班主任工号
     */
    @NotNull(message = "班主任工号不能为空")
    private String headTeacherId;

}
