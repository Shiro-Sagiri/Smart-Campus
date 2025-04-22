package com.shiro.campus.model.dto.survey;

import com.shiro.campus.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;


@EqualsAndHashCode(callSuper = true)
@Data
public class SurveyQueryRequest extends PageRequest {

    private String title;

}
