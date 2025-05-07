package com.shiro.campus.service.impl;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.constant.UserConstant;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.mapper.CampusCardMapper;
import com.shiro.campus.mapper.TransactionMapper;
import com.shiro.campus.mapper.UserMapper;
import com.shiro.campus.model.dto.CampusCard.CampusCardAddRequest;
import com.shiro.campus.model.dto.CampusCard.CampusCardQueryRequest;
import com.shiro.campus.model.entity.CampusCard;
import com.shiro.campus.model.entity.Transaction;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.model.vo.UserVO;
import com.shiro.campus.service.CampusCardService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

/**
 * @author ly179
 */
@Service
public class CampusCardServiceImpl extends ServiceImpl<CampusCardMapper, CampusCard> implements CampusCardService {

    private final CampusCardMapper campusCardMapper;
    private final UserMapper userMapper;
    private final TransactionMapper transactionMapper;

    public CampusCardServiceImpl(CampusCardMapper campusCardMapper, UserMapper userMapper, TransactionMapper transactionMapper) {
        this.campusCardMapper = campusCardMapper;
        this.userMapper = userMapper;
        this.transactionMapper = transactionMapper;
    }

    @Override
    public void addCampusCard(CampusCardAddRequest campusCardAddRequest, HttpServletRequest request) {
        LambdaQueryWrapper<User> w = new LambdaQueryWrapper<>();
        String userId = ((UserVO) request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE)).getUserId();
        if (ObjectUtil.isNull(campusCardAddRequest)) {
            w.eq(User::getUserId, userId);
        } else {
            userId = campusCardAddRequest.getUserId();
            w.eq(User::getUserId, userId);
        }
        User user = userMapper.selectOne(w);
        ThrowUtils.throwIf(ObjectUtil.isNull(user), ErrorCode.PARAMS_ERROR, "用户不存在!");
        LambdaQueryWrapper<CampusCard> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CampusCard::getUserId, userId);
        CampusCard campusCard = campusCardMapper.selectOne(wrapper);
        ThrowUtils.throwIf(ObjectUtil.isNotNull(campusCard), ErrorCode.PARAMS_ERROR, "该用户已有校园卡账户！");
        campusCard = new CampusCard();
        // 获取当前时间戳（秒级）
        long timestamp = Instant.now().getEpochSecond();
        // 取时间戳的后8位数字
        String timePart = String.format("%08d", timestamp % 100000000);
        // 生成4位随机数
        String randomPart = String.format("%04d", ThreadLocalRandom.current().nextInt(10000));
        campusCard.setCardId(timePart + randomPart);
        campusCard.setUserId(userId);
        campusCardMapper.insert(campusCard);
    }

    @Override
    public IPage<Transaction> listTransactionByPage(CampusCardQueryRequest campusCardQueryRequest, HttpServletRequest servletRequest) {
        int current = campusCardQueryRequest.getCurrent();
        int pageSize = campusCardQueryRequest.getPageSize();
        LambdaQueryWrapper<CampusCard> wrapper = new LambdaQueryWrapper<>();
        String userId = ((UserVO) servletRequest.getSession().getAttribute(UserConstant.USER_LOGIN_STATE)).getUserId();
        wrapper.eq(CampusCard::getUserId, userId);
        CampusCard campusCard = campusCardMapper.selectOne(wrapper);
        ThrowUtils.throwIf(ObjectUtil.isNull(campusCard), ErrorCode.PARAMS_ERROR, "校园卡未注册");
        LambdaQueryWrapper<Transaction> transactionWrapper = new LambdaQueryWrapper<>();
        transactionWrapper.eq(Transaction::getCardId, campusCard.getCardId());
        return transactionMapper.selectPage(new Page<>(current, pageSize), transactionWrapper);
    }

    @Override
    public IPage<CampusCard> listCampusCardByPage(CampusCardQueryRequest campusCardQueryRequest) {
        LambdaQueryWrapper<CampusCard> wrapper = buildQueryWrapper(campusCardQueryRequest);
        int current = campusCardQueryRequest.getCurrent();
        int pageSize = campusCardQueryRequest.getPageSize();
        return campusCardMapper.selectPage(new Page<>(current, pageSize), wrapper);
    }

    // 构建查询条件
    private LambdaQueryWrapper<CampusCard> buildQueryWrapper(CampusCardQueryRequest request) {
        LambdaQueryWrapper<CampusCard> wrapper = new LambdaQueryWrapper<>();
        Optional.ofNullable(request.getUserId()).ifPresent(id -> wrapper.eq(CampusCard::getUserId, id)); // 根据业务需求决定使用 eq 或 like
        return wrapper;
    }
}




