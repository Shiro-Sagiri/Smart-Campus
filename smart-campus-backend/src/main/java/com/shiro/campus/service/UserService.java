package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shiro.campus.common.BatchResult;
import com.shiro.campus.model.dto.user.UserAddRequest;
import com.shiro.campus.model.dto.user.UserQueryRequest;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.model.vo.UserVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.List;

/**
* @author ly179
* @description 针对表【user】的数据库操作Service
* @createDate 2025-03-31 16:48:11
*/
public interface UserService extends IService<User> {

    UserVO userLogin(String userId, String password, HttpServletRequest request);

    void addSingleUser(@Valid UserAddRequest userAddRequest);

    BatchResult batchAddUsers(@Valid List<@Valid UserAddRequest> userAddRequestList);

    IPage<UserVO> listUserByPage(@Valid UserQueryRequest userQueryRequest);
}
