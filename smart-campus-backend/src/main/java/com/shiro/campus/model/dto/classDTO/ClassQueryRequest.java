package com.shiro.campus.model.dto.classDTO;

import com.shiro.campus.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ClassQueryRequest extends PageRequest {
    /**
     * 所属专业
     */
    private String majorId;

    /**
     * 班主任工号
     */
    private String headTeacherId;
}
