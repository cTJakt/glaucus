package com.jtang.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.HashMap;

/**
 * Deep Learning Model
 * Created by lucas on 2017/6/18.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DLModel {
    @Id
    private String id;

    private String modelTypeId; //模型的类别

    private String picFileId;  //文件信息id

    private String modelName;   //自定义的训练模型名

    private boolean isTrained;  //是否进行了训练

    private String modelPath;       //具体训练出的model

    //private String resOfModel; //模型训练的result
    private HashMap<String, String> resOfModel; //模型训练的result
    //模型的具体参数取值
    private HashMap<String, String> arguments;  //模型的参数列表
}
