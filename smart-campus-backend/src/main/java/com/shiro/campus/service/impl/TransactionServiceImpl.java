package com.shiro.campus.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.model.entity.Transaction;
import com.shiro.campus.service.TransactionService;
import com.shiro.campus.mapper.TransactionMapper;
import org.springframework.stereotype.Service;

/**
* @author ly179
* @description 针对表【transaction】的数据库操作Service实现
* @createDate 2025-03-31 16:48:11
*/
@Service
public class TransactionServiceImpl extends ServiceImpl<TransactionMapper, Transaction>
    implements TransactionService{

}




