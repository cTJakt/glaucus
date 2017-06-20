package com.jtang.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;

/**
 * Created by LXY on 2016/11/14.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Config {

    @Id
    private String id;

    private String fileInfoId;      //文件id

    private String userId;          //用户Id

    private String modelTypeId;     //模型类id

    private String confName;        //自定义模型名

    //private List<String> fieldIds;   //选择训练的特征及特征描述
    private List<String> fieldIds;     //train feature list

    public String getId(){
        return id;
    }
    public List<String> getFieldIds(){
        return fieldIds;
    }
}
