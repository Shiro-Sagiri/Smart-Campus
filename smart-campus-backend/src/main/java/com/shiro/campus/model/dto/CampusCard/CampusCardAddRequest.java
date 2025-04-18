package com.shiro.campus.model.dto.CampusCard;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class CampusCardAddRequest implements Serializable {

    @NotNull(message = "工号/学号不能为空！")
    private String userId;

}
