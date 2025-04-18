package com.shiro.campus.model.dto.announcement;

import com.shiro.campus.common.PageRequest;
import com.shiro.campus.model.enums.AnnouncementTargetEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class AnnouncementQueryRequest extends PageRequest implements Serializable {

    private AnnouncementTargetEnum target;
    private String title;
}
