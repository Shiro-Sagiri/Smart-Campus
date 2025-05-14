package com.shiro.campus.service.impl;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.common.Argon2PasswordUtil;
import com.shiro.campus.common.BatchFailure;
import com.shiro.campus.common.BatchResult;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.exception.BusinessException;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.mapper.ClassMapper;
import com.shiro.campus.mapper.UserMapper;
import com.shiro.campus.model.dto.user.ChangePasswordRequest;
import com.shiro.campus.model.dto.user.UserAddRequest;
import com.shiro.campus.model.dto.user.UserQueryRequest;
import com.shiro.campus.model.entity.Class;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.model.enums.UserRoleEnum;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.shiro.campus.constant.UserConstant.USER_LOGIN_STATE;

@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final UserMapper userMapper;
    private final ClassMapper classMapper;

    public UserServiceImpl(UserMapper userMapper, ClassMapper classMapper) {
        this.userMapper = userMapper;
        this.classMapper = classMapper;
    }

    @Override
    public UserVO userLogin(String userId, String password, HttpServletRequest request) {
        if (password.length() < 8) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "密码错误");
        }
        // 查询用户是否存在
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserId, userId);
        User user = this.baseMapper.selectOne(wrapper);
        // 用户不存在
        if (user == null) {
            log.info("user login failed, userAccount cannot match userPassword");
            throw new BusinessException(ErrorCode.USERID_OR_PASSWORD_ERROR);
        }
        //验证密码
        ThrowUtils.throwIf(!Argon2PasswordUtil.verify(user.getPassword(), password), ErrorCode.USERID_OR_PASSWORD_ERROR);
        // 记录用户的登录态
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        request.getSession().setAttribute(USER_LOGIN_STATE, userVO);
        return userVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addSingleUser(UserAddRequest userAddRequest) {
        UserRoleEnum role = userAddRequest.getRole();
        if (role != UserRoleEnum.STUDENT) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserId, userAddRequest.getUserId());
            User user = userMapper.selectOne(wrapper);
            ThrowUtils.throwIf(ObjectUtil.isNotNull(user), ErrorCode.PARAMS_ERROR, "工号重复！");
            user = new User();
            BeanUtils.copyProperties(userAddRequest, user);
            user.setPassword(Argon2PasswordUtil.hash(user.getPassword()));
            userMapper.insert(user);
        } else {
            String classId = userAddRequest.getClassId();
            ThrowUtils.throwIf(ObjectUtil.isNull(classId), ErrorCode.PARAMS_ERROR, "班级不能为空！");
            LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
            userLambdaQueryWrapper.eq(User::getClassId, classId);
            List<User> users = userMapper.selectList(userLambdaQueryWrapper);
            int newSequence = users.size() + 1;
            String sequenceStr = String.format("%02d", newSequence);
            String userId = classId + sequenceStr;
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUserId, userId);
            User existUser = userMapper.selectOne(wrapper);
            ThrowUtils.throwIf(ObjectUtil.isNotNull(existUser), ErrorCode.PARAMS_ERROR, "学号重复！");
            User user = new User();
            BeanUtils.copyProperties(userAddRequest, user);
            user.setPassword(Argon2PasswordUtil.hash(user.getPassword()));
            user.setUserId(userId);  // 使用生成的学号
            userMapper.insert(user);
            // 更新班级人数
            Class aClass = classMapper.selectById(classId);
            System.out.println(aClass.getAdmissionYear());
            aClass.setStudentCount(users.size() + 1);
            classMapper.updateById(aClass);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public BatchResult batchAddUsers(List<@Valid UserAddRequest> userAddRequestList) {
        List<BatchFailure> failures = new ArrayList<>();
        List<User> userList = new ArrayList<>();
        AtomicInteger successCount = new AtomicInteger(0);
        List<String> userIds = userAddRequestList.stream().map(UserAddRequest::getUserId).toList();
        Set<String> existingUserIds = userMapper.selectList(new LambdaQueryWrapper<User>().select(User::getUserId).in(User::getUserId, userIds)).stream().map(User::getUserId).collect(Collectors.toSet());
        for (int i = 0; i < userAddRequestList.size(); i++) {
            UserAddRequest request = userAddRequestList.get(i);
            try {
                // 校验唯一性
                ThrowUtils.throwIf(existingUserIds.contains(request.getUserId()), ErrorCode.PARAMS_ERROR, "学号/工号 " + request.getUserId() + " 已存在");
                // 转换DTO到Entity
                User user = new User();
                BeanUtils.copyProperties(request, user);
                user.setPassword(Argon2PasswordUtil.hash(user.getPassword()));
                userList.add(user);
            } catch (Exception e) {
                failures.add(new BatchFailure(i, e.getMessage()));
            }
        }
        userMapper.insert(userList, 500);
        return new BatchResult(successCount.addAndGet(userList.size()), failures);
    }

    @Override
    public void updatePassword(ChangePasswordRequest changePasswordRequest) {
        String userId = changePasswordRequest.getUserId();
        String oldPassword = changePasswordRequest.getOldPassword();
        String newPassword = changePasswordRequest.getNewPassword();
        // 查询用户是否存在
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserId, userId);
        User user = this.baseMapper.selectOne(wrapper);
        // 用户不存在
        ThrowUtils.throwIf(ObjectUtil.isNull(user), ErrorCode.PARAMS_ERROR, "用户不存在！");
        //验证密码
        ThrowUtils.throwIf(!Argon2PasswordUtil.verify(user.getPassword(), oldPassword), ErrorCode.USERID_OR_PASSWORD_ERROR);
        user.setPassword(Argon2PasswordUtil.hash(newPassword));
        this.baseMapper.updateById(user);
    }

    @Override
    public IPage<UserVO> getStudentListByClassId(UserQueryRequest userQueryRequest) {
        userQueryRequest.setRole(UserRoleEnum.STUDENT);
        LambdaQueryWrapper<User> wrapper = buildQueryWrapper(userQueryRequest);
        wrapper.eq(User::getClassId, userQueryRequest.getClassId());
        int current = userQueryRequest.getCurrent();
        int pageSize = userQueryRequest.getPageSize();
        Page<User> userPage = userMapper.selectPage(new Page<>(current, pageSize), wrapper);
        return userPage.convert(user -> {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return userVO;
        });
    }

    @Override
    public IPage<UserVO> listUserByPage(UserQueryRequest userQueryRequest) {
        LambdaQueryWrapper<User> wrapper = buildQueryWrapper(userQueryRequest);
        int current = userQueryRequest.getCurrent();
        int pageSize = userQueryRequest.getPageSize();
        Page<User> userPage = userMapper.selectPage(new Page<>(current, pageSize), wrapper);
        return userPage.convert(user -> {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return userVO;
        });
    }

    // 构建查询条件
    private LambdaQueryWrapper<User> buildQueryWrapper(UserQueryRequest request) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getUserName()).ifPresent(name -> wrapper.like(User::getUserName, name));
        Optional.ofNullable(request.getUserId()).ifPresent(id -> wrapper.eq(User::getUserId, id)); // 根据业务需求决定使用 eq 或 like
        Optional.ofNullable(request.getRole())
                .ifPresentOrElse(
                        role -> wrapper.eq(User::getRole, role),
                        () -> wrapper.in(User::getRole, Arrays.asList(UserRoleEnum.TEACHER, UserRoleEnum.ADMIN)) // 空值时查询教师和管理员
                );
        return wrapper;
    }
}




