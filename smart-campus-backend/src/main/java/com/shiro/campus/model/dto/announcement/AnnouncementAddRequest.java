package com.shiro.campus.model.dto.announcement;

import com.shiro.campus.model.enums.AnnouncementTargetEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class AnnouncementAddRequest implements Serializable {

    @NotNull(message = "标题不能为空！")
    private String title;

    @NotNull(message = "内容不能为空！")
    private String content;

    @NotNull(message = "目标不能为空！")
    private AnnouncementTargetEnum target;

}
