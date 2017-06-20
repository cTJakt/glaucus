package com.jtang.services.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * HeaderInfoUpdatedPojo
 * Created by twenbo on 2017/3/27.
 */
@Data
@AllArgsConstructor
public class HeaderInfoUpdatedPojo {
    List<InnerHeaderInfo> headerInfo;
    List<Integer> headerNeedUpdate;
}
