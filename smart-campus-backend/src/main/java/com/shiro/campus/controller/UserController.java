package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.BatchResult;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.user.UserAddRequest;
import com.shiro.campus.model.dto.user.UserLoginRequest;
import com.shiro.campus.model.dto.user.UserQueryRequest;
import com.shiro.campus.model.dto.user.UserUpdateRequest;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.shiro.campus.constant.UserConstant.USER_LOGIN_STATE;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 用户登录
     */
    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public BaseResponse<UserVO> userLogin(@Valid @RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(userLoginRequest), ErrorCode.PARAMS_ERROR);
        UserVO loginUserVO = userService.userLogin(userLoginRequest.getUserId(), userLoginRequest.getPassword(), request);
        return ResultUtils.success(loginUserVO, "登入成功！");
    }

    // 单个添加
    @Operation(summary = "新增单个用户")
    @PostMapping("/add/single")
    public BaseResponse<Void> addUser(@Valid @RequestBody UserAddRequest userAddRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(userAddRequest), ErrorCode.PARAMS_ERROR);
        userService.addSingleUser(userAddRequest);
        return ResultUtils.success("添加成功！");
    }

    //批量添加
    @Operation(summary = "批量添加用户")
    @PostMapping("/add/batch")
    public BaseResponse<BatchResult> batchAddUsers(@Valid @RequestBody List<@Valid UserAddRequest> userAddRequestList) {
        return ResultUtils.success(userService.batchAddUsers(userAddRequestList));
    }

    @Operation(summary = "获取当前登入用户")
    @GetMapping("/currentUser")
    public BaseResponse<UserVO> getCurrentUser(HttpServletRequest request) {
        return ResultUtils.success((UserVO) request.getSession().getAttribute(USER_LOGIN_STATE));
    }

    @Operation(summary = "登出")
    @GetMapping("/logout")
    public BaseResponse<Void> logout(HttpServletRequest request) {
        request.getSession().setAttribute(USER_LOGIN_STATE, null);
        return ResultUtils.success("登出成功！");
    }

    @Operation(summary = "分页获取用户列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<UserVO>> listUserByPage(@Valid @RequestBody UserQueryRequest userQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(userQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(userService.listUserByPage(userQueryRequest));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取用户")
    public BaseResponse<UserVO> getUserById(@PathVariable String id) {
        UserVO userVO = new UserVO();
        User user = userService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(user), ErrorCode.PARAMS_ERROR, "用户不存在");
        BeanUtils.copyProperties(user, userVO);
        return ResultUtils.success(userVO);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除用户")
    public BaseResponse<Void> deleteUserById(@PathVariable String id) {
        User user = userService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(user), ErrorCode.PARAMS_ERROR, "用户不存在！");
        userService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新用户")
    public BaseResponse<Void> updateUserById(@RequestBody UserUpdateRequest userUpdateRequest, @PathVariable Integer id) {
        ThrowUtils.throwIf(ObjectUtil.isNull(userUpdateRequest), ErrorCode.PARAMS_ERROR);
        User user = new User();
        BeanUtils.copyProperties(userUpdateRequest, user);
        user.setId(id);
        userService.updateById(user);
        return ResultUtils.success("更新成功!");
    }

}
