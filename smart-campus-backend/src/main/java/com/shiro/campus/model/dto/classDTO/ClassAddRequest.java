package com.shiro.campus.model.dto.classDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassAddRequest {

    /**
     * 班级ID
     */
    @NotNull(message = "班级ID不能为空")
    private String classId;

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

    /**
     * 入学年份
     */
    @NotNull(message = "入学年份不能为空")
    private String admissionYear;

}
