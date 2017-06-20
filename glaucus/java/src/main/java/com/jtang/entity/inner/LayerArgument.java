package com.jtang.entity.inner;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Keras Layer Arguments
 * Created by lucas on 2017/6/15.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LayerArgument {
    private boolean isDiscrete;  //是否为离散值
    private String value; //参数的默认值
    private String type;         //模型参数取值为Float|Int|...
    private String[] valueDes;   //取值范围或者离散值则为取值量
    private String description;  //对取值或者参数的说明
}
