package com.shiro.campus.model.vo;

import lombok.Data;

@Data
public class Schedule {
    //周次
    private String weeks;
    //星期
    private String weekdays;
    //节次
    private String sections;
    //标注
    private String remark;
}
