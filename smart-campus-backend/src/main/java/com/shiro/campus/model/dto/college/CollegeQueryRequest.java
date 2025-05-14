package com.shiro.campus.model.dto.college;

import com.shiro.campus.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class CollegeQueryRequest extends PageRequest {
    /**
     * 学院id
     */
    private String collegeId;

    /**
     * 学院名称
     */
    private String collegeName;
}
