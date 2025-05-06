package com.shiro.campus.model.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BorrowedBookVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String cover;
    private Integer recordId;
    private Integer bookId;
    private String title;
    private String author;
    private LocalDateTime borrowTime;
    private LocalDate dueTime;
    private LocalDateTime returnTime;
    private BigDecimal fine;
    private Integer isPay;
}
