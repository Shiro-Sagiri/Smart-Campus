package com.shiro.campus.model.dto.grade;

import com.shiro.campus.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class GradeQueryRequest extends PageRequest {
    private String semester;
}
