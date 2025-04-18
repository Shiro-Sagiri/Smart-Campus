package com.shiro.campus.model.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @TableName campus_card
 */
@TableName(value = "campus_card")
@Data
public class CampusCard implements Serializable {
    /**
     * 校园卡号
     */
    @TableId
    private String cardId;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 余额
     */
    private BigDecimal balance;

    /**
     * 挂失状态
     */
    private Integer isLost;

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        CampusCard other = (CampusCard) that;
        return (this.getCardId() == null ? other.getCardId() == null : this.getCardId().equals(other.getCardId()))
                && (this.getUserId() == null ? other.getUserId() == null : this.getUserId().equals(other.getUserId()))
                && (this.getBalance() == null ? other.getBalance() == null : this.getBalance().equals(other.getBalance()))
                && (this.getIsLost() == null ? other.getIsLost() == null : this.getIsLost().equals(other.getIsLost()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getCardId() == null) ? 0 : getCardId().hashCode());
        result = prime * result + ((getUserId() == null) ? 0 : getUserId().hashCode());
        result = prime * result + ((getBalance() == null) ? 0 : getBalance().hashCode());
        result = prime * result + ((getIsLost() == null) ? 0 : getIsLost().hashCode());
        return result;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() +
                " [" +
                "Hash = " + hashCode() +
                ", cardId=" + cardId +
                ", userId=" + userId +
                ", balance=" + balance +
                ", isLost=" + isLost +
                ", serialVersionUID=" + serialVersionUID +
                "]";
    }
}