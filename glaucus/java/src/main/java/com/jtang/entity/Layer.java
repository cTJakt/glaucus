package com.jtang.entity;

import com.jtang.entity.inner.LayerArgument;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.HashMap;

/**
 * Keras Layer Entity
 * Created by lucas on 2017/6/15.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Layer {
    @Id
    private String id;

    private String layerName;   //层的名称，如Dense，Activation，Conv2D等

    private HashMap<String, LayerArgument> arguments;  //层的参数列表

    private String layerDetailDes; //模型的详细描述

    private String layerDes; //模型的简要描述
}
