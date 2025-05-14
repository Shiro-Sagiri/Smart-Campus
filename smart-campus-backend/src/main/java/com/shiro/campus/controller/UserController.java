package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.BatchResult;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.user.*;
import com.shiro.campus.model.entity.Class;
import com.shiro.campus.model.entity.College;
import com.shiro.campus.model.entity.Major;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.model.enums.UserRoleEnum;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.ClassService;
import com.shiro.campus.service.CollegeService;
import com.shiro.campus.service.MajorService;
import com.shiro.campus.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static com.shiro.campus.constant.UserConstant.USER_LOGIN_STATE;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ClassService classService;
    private final MajorService majorService;
    private final CollegeService collegeService;


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
        UserVO userVO = (UserVO) request.getSession().getAttribute(USER_LOGIN_STATE);
        if (userVO.getRole() == UserRoleEnum.STUDENT) {
            LambdaQueryWrapper<Class> classLambdaQueryWrapper = new LambdaQueryWrapper<>();
            classLambdaQueryWrapper.eq(Class::getClassId, userVO.getClassId());
            Class aClass = classService.getOne(classLambdaQueryWrapper);
            LambdaQueryWrapper<Major> majorLambdaQueryWrapper = new LambdaQueryWrapper<>();
            majorLambdaQueryWrapper.eq(Major::getMajorId, aClass.getMajorId());
            Major major = majorService.getOne(majorLambdaQueryWrapper);
            LambdaQueryWrapper<College> collegeLambdaQueryWrapper = new LambdaQueryWrapper<>();
            collegeLambdaQueryWrapper.eq(College::getCollegeId, major.getCollegeId());
            College college = collegeService.getOne(collegeLambdaQueryWrapper);
            userVO.setMajorName(major.getMajorName());
            userVO.setCollegeName(college.getCollegeName());
        }
        return ResultUtils.success(userVO);
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
    @Transactional(rollbackFor = Exception.class)
    public BaseResponse<Void> deleteUserById(@PathVariable String id) {
        User user = userService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(user), ErrorCode.PARAMS_ERROR, "用户不存在！");
        if (user.getRole() == UserRoleEnum.STUDENT) {
            String classId = user.getClassId();
            Class aClass = classService.getById(classId);
            aClass.setStudentCount(aClass.getStudentCount() - 1);
            classService.updateById(aClass);
        }
        userService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "根据id更新用户")
    public BaseResponse<Void> updateUserById(@RequestBody UserUpdateRequest userUpdateRequest, @PathVariable String id, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isNull(userUpdateRequest), ErrorCode.PARAMS_ERROR);
        User user = new User();
        BeanUtils.copyProperties(userUpdateRequest, user);
        user.setUserId(id);
        userService.updateById(user);
        user = userService.getById(user.getUserId());
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        //更新session
        request.getSession().setAttribute(USER_LOGIN_STATE, userVO);
        return ResultUtils.success("更新成功!");
    }

    //获取职工列表
    @Operation(summary = "获取职工列表")
    @GetMapping("/get/teacher")
    public BaseResponse<List<UserVO>> getTeacherList() {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getRole, UserRoleEnum.TEACHER);
        List<User> teacherList = userService.list(wrapper);
        List<UserVO> teacherVOList = new ArrayList<>();
        for (User user : teacherList) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            teacherVOList.add(userVO);
        }
        return ResultUtils.success(teacherVOList);
    }

    //根据班级id分页获取学生列表
    @Operation(summary = "根据班级id分页获取学生列表")
    @PostMapping("/get/student/page")
    public BaseResponse<IPage<UserVO>> getStudentListByClassId(@Valid @RequestBody UserQueryRequest userQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(userQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(userService.getStudentListByClassId(userQueryRequest));
    }

    //修改密码
    @Operation(summary = "修改密码")
    @PutMapping("/update/password")
    public BaseResponse<Void> updatePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(changePasswordRequest), ErrorCode.PARAMS_ERROR);
        userService.updatePassword(changePasswordRequest);
        return ResultUtils.success("修改成功！");
    }
}
