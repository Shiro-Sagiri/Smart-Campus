package com.shiro.campus.model.dto.announcement;

import com.shiro.campus.model.enums.AnnouncementTargetEnum;
import lombok.Data;

import java.io.Serializable;

@Data
public class AnnouncementUpdateRequest implements Serializable {

    private String title;
    private String content;
    private AnnouncementTargetEnum target;
}
