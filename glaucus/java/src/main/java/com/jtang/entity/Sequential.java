package com.jtang.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.HashMap;
import java.util.List;

/**
 * Keras Sequential(Pipelines)
 * Created by lucas on 2017/6/15.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Sequential {
    @Id
    private String id;

    private List<Layer> layerIds; //序列的层数

    private String fileInfoId;  //文件信息id

    private String seqName;   //自定义的训练模型名

    private boolean isTrained;  //是否进行了训练

    private String seqPath;       //具体训练出的model

    //private String resOfModel; //模型训练的result
    private HashMap<String, String> resOfSeq; //模型训练的result

}
