package com.shiro.campus.model.vo;

import com.shiro.campus.model.enums.UserRoleEnum;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class UserVO implements Serializable {
    /**
     * 用户ID
     */
    private Integer id;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 角色
     */
    private UserRoleEnum role;

    /**
     * 学号或工号
     */
    private String userId;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 用户头像url
     */
    private String userAvatar;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 注册时间
     */
    private Date createdTime;
}
