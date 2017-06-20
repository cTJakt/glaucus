package com.jtang.services.pojo;


import com.jtang.entity.HeaderInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
import java.util.HashMap;
import java.util.List;


/**
 * Created by twenbo on 2016/11/15.
 */

@Data
@AllArgsConstructor
public class FileDetailPojo {

    //private String fileId;
    private String fileName;
    private Date createTime;
    private HashMap<String, String> fileStrucInfo;
    private List<HeaderInfo> headerInfos;
}
