package com.shiro.campus.model.dto.courseComment;

import lombok.Data;

@Data
public class CourseCommentAddRequest {
    private Integer rating;
    private String comment;
    private Integer courseId;
}
