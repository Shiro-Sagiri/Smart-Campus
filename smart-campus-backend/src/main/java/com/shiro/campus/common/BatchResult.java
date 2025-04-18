package com.shiro.campus.common;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BatchResult {
    private Integer successCount;
    private List<BatchFailure> failures;
}
