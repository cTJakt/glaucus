package com.jtang.services.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Created by LXY on 2017/6/16.
 */
@Data
@AllArgsConstructor
public class ConfigModelPojo {
    private String modelName;

    private String modelDetailName;

    private int trainedStatus;
}
