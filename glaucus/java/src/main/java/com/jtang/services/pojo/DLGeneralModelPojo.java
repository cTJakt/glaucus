package com.jtang.services.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * return general model info
 * Created by lucas on 2017/6/18.
 */
@Data
@AllArgsConstructor
public class DLGeneralModelPojo {
    public String modelId;
    public String modelName;
    public String fileId;
    public String fileName;
    public boolean isTrain;
    public boolean hasResult;
}
