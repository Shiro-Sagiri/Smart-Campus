package com.shiro.campus.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BatchFailure {
    private Integer index;
    private String reason;
}
