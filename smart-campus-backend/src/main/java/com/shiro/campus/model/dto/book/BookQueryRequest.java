package com.shiro.campus.model.dto.book;

import com.shiro.campus.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class BookQueryRequest extends PageRequest implements Serializable {

    private String title;

    private String author;

    private String search;

}
