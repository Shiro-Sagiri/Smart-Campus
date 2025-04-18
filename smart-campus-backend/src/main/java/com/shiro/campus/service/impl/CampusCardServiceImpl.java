package com.shiro.campus.service.impl;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.mapper.CampusCardMapper;
import com.shiro.campus.mapper.UserMapper;
import com.shiro.campus.model.dto.CampusCard.CampusCardAddRequest;
import com.shiro.campus.model.dto.CampusCard.CampusCardQueryRequest;
import com.shiro.campus.model.entity.CampusCard;
import com.shiro.campus.model.entity.User;
import com.shiro.campus.service.CampusCardService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

/**
 * @author ly179
 */
@Service
public class CampusCardServiceImpl extends ServiceImpl<CampusCardMapper, CampusCard>
        implements CampusCardService {

    private final CampusCardMapper campusCardMapper;
    private final UserMapper userMapper;

    public CampusCardServiceImpl(CampusCardMapper campusCardMapper, UserMapper userMapper) {
        this.campusCardMapper = campusCardMapper;
        this.userMapper = userMapper;
    }

    @Override
    public void addCampusCard(CampusCardAddRequest campusCardAddRequest) {
        LambdaQueryWrapper<User> w = new LambdaQueryWrapper<>();
        w.eq(User::getUserId, campusCardAddRequest.getUserId());
        User user = userMapper.selectOne(w);
        ThrowUtils.throwIf(ObjectUtil.isNull(user), ErrorCode.PARAMS_ERROR, "用户不存在!");
        LambdaQueryWrapper<CampusCard> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CampusCard::getUserId, campusCardAddRequest.getUserId());
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
        BeanUtils.copyProperties(campusCardAddRequest, campusCard);
        campusCardMapper.insert(campusCard);
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




