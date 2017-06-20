package com.jtang.services.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

/**
 * Created by twb on 2017/6/1.
 */
@Data
@AllArgsConstructor
public class PathPojo {
    private String pathName;
    private Date date;
}
