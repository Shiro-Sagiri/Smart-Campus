package com.shiro.campus.model.dto.CampusCard;

import com.shiro.campus.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class CampusCardQueryRequest extends PageRequest implements Serializable {

    private String userId;
}
