package com.jtang.services.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashMap;

/**
 * return model object
 * Created by twenbo on 2016/11/21.
 */
@Data
@AllArgsConstructor
public class ModelPojo {

    private String configId;

    private String configName;

    private String modelTypeId;

    private String modelTypeName;

    private String modelDetailName;

    private String modelDetailDes;

    private String modelDes;

    private String modelId;

    private String modelName;

    private int trainedStatus;


    private HashMap<String, String> arguments;

    private HashMap<String, String> resOfModel;
}
