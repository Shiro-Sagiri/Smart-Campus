package com.shiro.campus.model.dto.user;

import com.shiro.campus.model.enums.UserRoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

@Data
public class UserAddRequest implements Serializable {

    /**
     * 用户名
     */
    @NotNull(message = "用户名不能为空！")
    private String userName;

    /**
     * 加密密码
     */
    @NotNull(message = "密码不能为空！")
    @Size(min = 8, max = 20, message = "密码长度需在8-20位之间")
    private String password;

    /**
     * 角色
     */
    @NotNull(message = "职能不能为空！")
    private UserRoleEnum role;

    /**
     * 学号或工号
     */
    @NotNull(message = "学号或工号不能为空！")
    private String userId;

    /**
     * 用户头像url
     */
    private String userAvatar;

    /**
     * 邮箱
     */
    @Email
    private String email;

    /**
     * 手机号
     */
    @Pattern(regexp = "^1[3-9]\\d{9}$",message = "手机号格式错误！")
    @NotNull(message = "手机号不能为空！")
    private String phone;
}
