package com.shiro.campus.model.dto.grade;

import lombok.Data;

@Data
public class GradeAddRequest {
    private String studentId;
    private Integer courseId;
    private Double score;
}
