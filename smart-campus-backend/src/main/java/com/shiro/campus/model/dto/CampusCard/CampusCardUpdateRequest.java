package com.shiro.campus.model.dto.CampusCard;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class CampusCardUpdateRequest implements Serializable {
    /**
     * 挂失状态
     */
    private Integer isLost;

    /**
     * 余额
     */
    private BigDecimal balance;
}
