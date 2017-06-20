package com.jtang.services.pojo;

import com.jtang.entity.FuncInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * Created by Administrator on 2017/4/12.
 */
@Data
@AllArgsConstructor
public class FileAndFuncInfoPojo {
    List<FileNamePojo> fileNamePojos;
    List<FuncInfo> funcInfos;
}
