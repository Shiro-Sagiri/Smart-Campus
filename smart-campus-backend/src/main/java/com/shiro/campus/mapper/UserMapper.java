package com.shiro.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shiro.campus.model.entity.User;

import java.util.List;

/**
 * @author ly179
 * @description 针对表【user】的数据库操作Mapper
 * @createDate 2025-03-31 16:48:11
 * @Entity com.shiro.campus.model.entity.User
 */
public interface UserMapper extends BaseMapper<User> {

    void batchAddUsers(List<User> userList);
}




