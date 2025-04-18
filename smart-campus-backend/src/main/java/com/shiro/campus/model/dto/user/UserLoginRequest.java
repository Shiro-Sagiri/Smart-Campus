package com.shiro.campus.model.dto.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

@Data
public class UserLoginRequest implements Serializable {

    /**
     * 学号或工号
     */
    @NotNull(message = "学号或工号不能为空！")
    private String userId;

    /**
     * 加密密码
     */
    @NotNull(message = "密码不能为空！")
    @Size(min = 8, max = 20, message = "密码长度需在8-20位之间")
    private String password;
}
