package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shiro.campus.model.dto.grade.GradeQueryRequest;
import com.shiro.campus.model.dto.user.UserQueryRequest;
import com.shiro.campus.model.entity.Grade;
import com.shiro.campus.model.vo.GradeVO;
import com.shiro.campus.model.vo.UserVO;
import jakarta.servlet.http.HttpServletRequest;

/**
 * @author ly179
 * @description 针对表【grade】的数据库操作Service
 * @createDate 2025-03-31 16:48:11
 */
public interface GradeService extends IService<Grade> {

    IPage<UserVO> listStudentByPage(UserQueryRequest userQueryRequest, Integer id);

    IPage<GradeVO> listByPage(GradeQueryRequest gradeQueryRequest, HttpServletRequest request);

    Double getGPA(String userId);
}
