package com.shiro.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shiro.campus.model.dto.CampusCard.CampusCardAddRequest;
import com.shiro.campus.model.dto.CampusCard.CampusCardQueryRequest;
import com.shiro.campus.model.entity.CampusCard;
import jakarta.validation.Valid;

/**
* @author ly179
*/
public interface CampusCardService extends IService<CampusCard> {

    void addCampusCard(@Valid CampusCardAddRequest campusCardAddRequest);

    IPage<CampusCard> listCampusCardByPage(@Valid CampusCardQueryRequest campusCardQueryRequest);
}
