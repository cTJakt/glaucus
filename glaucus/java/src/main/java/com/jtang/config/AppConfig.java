package com.jtang.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 *
 * Created by lucas on 2016/10/10.
 */
@Data
@Component
public class AppConfig {

    @Value("${com.jtang.spark.serverAddr}")
    private String sparkServerAddr;
    @Value("${com.jtang.spark.appName}")
    private String appName;
    @Value("${com.jtang.hdfs.serverAddr}")
    private String hdfsServerAddr;
    @Value("${com.jtang.spark.executorMemory}")
    private String executorMemory;
    @Value("${com.jtang.picture.uri}")
    private String picPath;

    public String getAppName() {
        return appName;
    }
    public String getSparkServer() {
        return sparkServerAddr;
    }

    public String getHdfsServerAddr() {
        return hdfsServerAddr;
    }

    public String getExecutorMemory() { return executorMemory; }

    public String getAbsolutePath() { return picPath;}
}
