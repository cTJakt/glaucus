package com.jtang.entity;

import com.jtang.entity.inner.ModelArgument;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.HashMap;

/**
 *
 * Created by LXY on 2016/11/14.
 * Changed by Lucas on 2017/06/16
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelType {

    @Id
    private String id;

    private String modelTypeName;

    private String modelDetailName;

    private HashMap<String, ModelArgument> arguments;

    private String modelDetailDes;

    private String modelDes;

    public ModelType(String modelTypeName, String modelDetailName, HashMap<String, ModelArgument> arguments,
                     String modelDetailDes, String modelDes) {
        this.modelTypeName = modelTypeName;
        this.modelDetailName = modelDetailName;
        this.arguments = arguments;
        this.modelDetailDes = modelDetailDes;
        this.modelDes = modelDes;
    }


}
