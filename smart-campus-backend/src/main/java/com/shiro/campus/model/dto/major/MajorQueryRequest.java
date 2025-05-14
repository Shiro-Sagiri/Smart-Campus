package com.shiro.campus.model.dto.major;

import com.shiro.campus.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class MajorQueryRequest extends PageRequest {
    /**
     * 专业id
     */
    private String majorId;

    /**
     * 专业名称
     */
    private String majorName;

    /**
     * 所属学院
     */
    private String collegeId;
}
