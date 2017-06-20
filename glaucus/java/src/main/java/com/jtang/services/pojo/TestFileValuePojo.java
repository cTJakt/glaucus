package com.jtang.services.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * Model Prediction File Pojo
 * Created by lucas on 2017/5/2.
 */
@Data
@AllArgsConstructor
public class TestFileValuePojo {
    private String fileId;
    private List<Map<String, String>> values;
}
