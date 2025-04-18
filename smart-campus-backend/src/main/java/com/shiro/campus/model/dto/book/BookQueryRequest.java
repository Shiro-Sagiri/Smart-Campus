package com.shiro.campus.model.dto.book;

import com.shiro.campus.common.PageRequest;
import com.shiro.campus.model.enums.BookStatusEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class BookQueryRequest extends PageRequest implements Serializable {

    private String title;

    private BookStatusEnum status;

    private String author;

}
