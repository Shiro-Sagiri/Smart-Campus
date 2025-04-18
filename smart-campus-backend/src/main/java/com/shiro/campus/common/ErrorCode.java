package com.shiro.campus.common;

import lombok.Getter;

/**
 * 自定义错误码
 */

@Getter
public enum ErrorCode {

    SUCCESS(0, "ok"),
    PARAMS_ERROR(40000, "请求参数错误"),
    BALANCE_NOT_ENOUGH_ERROR(40001, "余额不足"),
    NOT_LOGIN_ERROR(40100, "未登录"),
    USERID_OR_PASSWORD_ERROR(40301, "账号或密码错误"),
    NO_AUTH_ERROR(40101, "无权限"),
    NOT_FOUND_ERROR(40400, "请求数据不存在"),
    FORBIDDEN_ERROR(40300, "禁止访问"),
    SYSTEM_ERROR(50000, "系统内部异常"),
    OPERATION_ERROR(50001, "操作失败");

    /**
     * 状态码
     */
    private final int code;

    /**
     * 信息
     */
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

}
