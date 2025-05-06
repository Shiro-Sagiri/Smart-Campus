package com.shiro.campus.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * @TableName borrow_record
 */
@TableName(value = "borrow_record")
@Data
public class BorrowRecord implements Serializable {
    /**
     * 借阅ID
     */
    @TableId(type = IdType.AUTO)
    private Integer recordId;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 校园卡ID
     */
    private Integer bookId;

    /**
     * 借出时间
     */
    private LocalDateTime borrowTime;

    /**
     * 应还时间
     */
    private LocalDate dueTime;

    /**
     * 实际归还时间
     */
    private LocalDateTime returnTime;

    /**
     * 罚款金额
     */
    private BigDecimal fine;

    private Integer isPay;

    /**
     * 逻辑删除标记
     */
    @TableLogic
    private Integer isDeleted;

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
        BorrowRecord other = (BorrowRecord) that;
        return (this.getRecordId() == null ? other.getRecordId() == null : this.getRecordId().equals(other.getRecordId()))
                && (this.getUserId() == null ? other.getUserId() == null : this.getUserId().equals(other.getUserId()))
                && (this.getBookId() == null ? other.getBookId() == null : this.getBookId().equals(other.getBookId()))
                && (this.getBorrowTime() == null ? other.getBorrowTime() == null : this.getBorrowTime().equals(other.getBorrowTime()))
                && (this.getDueTime() == null ? other.getDueTime() == null : this.getDueTime().equals(other.getDueTime()))
                && (this.getReturnTime() == null ? other.getReturnTime() == null : this.getReturnTime().equals(other.getReturnTime()))
                && (this.getFine() == null ? other.getFine() == null : this.getFine().equals(other.getFine()))
                && (this.getIsDeleted() == null ? other.getIsDeleted() == null : this.getIsDeleted().equals(other.getIsDeleted()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getRecordId() == null) ? 0 : getRecordId().hashCode());
        result = prime * result + ((getUserId() == null) ? 0 : getUserId().hashCode());
        result = prime * result + ((getBookId() == null) ? 0 : getBookId().hashCode());
        result = prime * result + ((getBorrowTime() == null) ? 0 : getBorrowTime().hashCode());
        result = prime * result + ((getDueTime() == null) ? 0 : getDueTime().hashCode());
        result = prime * result + ((getReturnTime() == null) ? 0 : getReturnTime().hashCode());
        result = prime * result + ((getFine() == null) ? 0 : getFine().hashCode());
        result = prime * result + ((getIsDeleted() == null) ? 0 : getIsDeleted().hashCode());
        return result;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() +
                " [" +
                "Hash = " + hashCode() +
                ", recordId=" + recordId +
                ", userId=" + userId +
                ", bookId=" + bookId +
                ", borrowTime=" + borrowTime +
                ", dueTime=" + dueTime +
                ", returnTime=" + returnTime +
                ", fine=" + fine +
                ", isDeleted=" + isDeleted +
                ", serialVersionUID=" + serialVersionUID +
                "]";
    }
}