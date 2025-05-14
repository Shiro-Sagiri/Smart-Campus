package com.shiro.campus.model.vo;

import lombok.Data;

@Data
public class RankVO {
    private String studentId;

    private String studentName;

    private Double GPA;

    private Integer ClassRank;

    private Integer MajorRank;

    private Double totalCredit;

    private Double requiredCredit;

    private Double failCredit;

    private Integer totalCourse;

}
