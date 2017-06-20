package com.jtang.services.pojo;

import com.jtang.entity.HeaderInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * Created by twenbo on 2016/11/17.
 * Changed by Lucas on 2016/11/22.
 */

@Data
@AllArgsConstructor
public class ConfigPojo {

    private String fileId;

    private String fileName;

    private String configId;

    private String modelTypeId;

    private String modelTypeName;

    //private String modelDes;

    private String confName;

    //private List<String> featureList;

    //
    private List<HeaderInfo> featureList;
}
