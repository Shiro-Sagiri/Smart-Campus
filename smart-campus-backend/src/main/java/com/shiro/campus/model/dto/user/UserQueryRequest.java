package com.shiro.campus.model.dto.user;

import com.shiro.campus.common.PageRequest;
import com.shiro.campus.model.enums.UserRoleEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserQueryRequest extends PageRequest implements Serializable {
    /**
     * 学号或工号
     */
    private String userId;

    /**
     * 角色
     */
    private UserRoleEnum role;

    /**
     * 用户名
     */
    private String userName;

}
