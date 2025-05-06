package com.shiro.campus.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shiro.campus.common.BaseResponse;
import com.shiro.campus.common.ErrorCode;
import com.shiro.campus.common.ResultUtils;
import com.shiro.campus.exception.ThrowUtils;
import com.shiro.campus.model.dto.CampusCard.CampusCardAddRequest;
import com.shiro.campus.model.dto.CampusCard.CampusCardQueryRequest;
import com.shiro.campus.model.dto.CampusCard.CampusCardUpdateRequest;
import com.shiro.campus.model.entity.CampusCard;
import com.shiro.campus.model.entity.Transaction;
import com.shiro.campus.model.enums.TransactionTypeEnum;
import com.shiro.campus.service.CampusCardService;
import com.shiro.campus.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/campusCard")
public class CampusCardController {
    private final CampusCardService campusCardService;
    private final TransactionService transactionService;

    public CampusCardController(CampusCardService campusCardService, TransactionService transactionService) {
        this.campusCardService = campusCardService;
        this.transactionService = transactionService;
    }

    @Operation(summary = "新增校园卡")
    @PostMapping("/add/single")
    public BaseResponse<Void> addCampusCard(@Valid @RequestBody CampusCardAddRequest campusCardAddRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(campusCardAddRequest), ErrorCode.PARAMS_ERROR);
        campusCardService.addCampusCard(campusCardAddRequest);
        return ResultUtils.success("添加成功！");
    }

    @Operation(summary = "分页获取校园卡列表")
    @PostMapping("/page/list")
    public BaseResponse<IPage<CampusCard>> listCampusCardByPage(@Valid @RequestBody CampusCardQueryRequest campusCardQueryRequest) {
        ThrowUtils.throwIf(ObjectUtil.isNull(campusCardQueryRequest), ErrorCode.PARAMS_ERROR);
        return ResultUtils.success(campusCardService.listCampusCardByPage(campusCardQueryRequest));
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "根据id获取校园卡")
    public BaseResponse<CampusCard> getCampusCardById(@PathVariable String id) {
        CampusCard campusCard = campusCardService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(campusCard), ErrorCode.PARAMS_ERROR, "校园卡不存在");
        return ResultUtils.success(campusCard);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "根据id删除校园卡")
    public BaseResponse<Void> deleteCampusCardById(@PathVariable String id) {
        CampusCard campusCard = campusCardService.getById(id);
        ThrowUtils.throwIf(ObjectUtil.isNull(campusCard), ErrorCode.PARAMS_ERROR, "校园卡不存在！");
        campusCardService.removeById(id);
        return ResultUtils.success("删除成功!");
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "更新校园卡")
    @Transactional(rollbackFor = Exception.class)
    public BaseResponse<Void> updateCampusCardById(@RequestBody CampusCardUpdateRequest campusCardUpdateRequest, @PathVariable String id) {
        ThrowUtils.throwIf(ObjectUtil.isNull(campusCardUpdateRequest), ErrorCode.PARAMS_ERROR);
        ThrowUtils.throwIf(campusCardUpdateRequest.getBalance() == null && campusCardUpdateRequest.getIsLost() == null, ErrorCode.PARAMS_ERROR);
        ThrowUtils.throwIf(campusCardUpdateRequest.getBalance() != null && campusCardUpdateRequest.getIsLost() != null, ErrorCode.PARAMS_ERROR);
        CampusCard campusCard = new CampusCard();
        campusCard.setCardId(id);
        if (campusCardUpdateRequest.getBalance() != null) {
            CampusCard card = campusCardService.getById(id);
            ThrowUtils.throwIf(card.getIsLost() == 1, ErrorCode.PARAMS_ERROR, "校园卡已挂失！");
            campusCard.setBalance(card.getBalance().add(campusCardUpdateRequest.getBalance()));
            Transaction transaction = new Transaction();
            transaction.setAmount(campusCardUpdateRequest.getBalance());
            transaction.setCardId(id);
            transaction.setType(TransactionTypeEnum.RECHARGE);
            transactionService.save(transaction);
        }
        if (campusCardUpdateRequest.getIsLost() != null) {
            campusCard.setIsLost(campusCardUpdateRequest.getIsLost());
        }
        campusCardService.updateById(campusCard);
        return ResultUtils.success("更新成功!");
    }

    //消费
    @PostMapping("/spend/{id}")
    @Operation(summary = "消费")
    @Transactional(rollbackFor = Exception.class)
    public BaseResponse<Void> spend(@PathVariable String id, @RequestParam("amount") Double amount) {
        LambdaQueryWrapper<CampusCard> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CampusCard::getUserId, id);
        CampusCard campusCard = campusCardService.getOne(wrapper);
        ThrowUtils.throwIf(ObjectUtil.isNull(campusCard), ErrorCode.PARAMS_ERROR, "校园卡不存在！");
        ThrowUtils.throwIf(campusCard.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0, ErrorCode.PARAMS_ERROR, "余额不足！");
        ThrowUtils.throwIf(campusCard.getIsLost() == 1, ErrorCode.PARAMS_ERROR, "校园卡已挂失！");
        campusCard.setBalance(campusCard.getBalance().subtract(BigDecimal.valueOf(amount)));
        Transaction transaction = new Transaction();
        transaction.setAmount(BigDecimal.valueOf(amount));
        transaction.setCardId(campusCard.getCardId());
        transaction.setType(TransactionTypeEnum.SPEND);
        transactionService.save(transaction);
        campusCardService.updateById(campusCard);
        return ResultUtils.success("支付成功!");
    }
}
