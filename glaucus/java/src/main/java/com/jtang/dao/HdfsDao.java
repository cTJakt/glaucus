package com.jtang.dao;

import com.jtang.config.AppConfig;
import com.jtang.util.FileHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * this file is used to complete hdfs operates and mongodb operates
 * MongoDB, we now create user, fileLoc as collections
 * Created by LXY on 2016/10/19.
 */
@Component
@Slf4j
public class HdfsDao {

    private final AppConfig appConfig;
    //connect to hdfs
    private FileSystem hdfs;
    private Configuration conf;
    private String hdfsUri;  //get hdfs Address

    @Autowired
    public HdfsDao(AppConfig appConfig) {
        this.appConfig = appConfig;
        conf = new Configuration();
        hdfsUri = appConfig.getHdfsServerAddr();
        setConf();
    }

    //set the configuration and get connection
    private void setConf(){
        conf.set("fs.defaultFS", hdfsUri);
        //System.out.println(conf);
        try {
            hdfs = FileSystem.get(conf);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    //put the local file to the hdfs
    public String putFile(String localFile){
        setConf();
        String fileName = FileHelper.getFile(localFile);//get the fileName
        String hdfsPathStr = hdfsUri + fileName;
        Path localPath = new Path(localFile);
        Path hdfsPath = new Path(hdfsPathStr);
        /*System.out.println(localPath);
        System.out.println(hdfsPath);*/
        try {
            hdfs.copyFromLocalFile(localPath,hdfsPath);
            hdfs.close();
            return hdfsPathStr;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    //delete file not in mongodb
    public boolean deleteFileInHdfs(String path, boolean isFolder){
        setConf();
        log.info("delete HDFS file: " + path);
        boolean isdelete = false;
        Path hdfsPath = new Path(path);
        try {
            if (hdfs.exists(hdfsPath)) {
                System.out.println("12333333");
                isdelete = hdfs.delete(hdfsPath, isFolder);
            }
            hdfs.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(isdelete);
        return isdelete;
    }

    //get all files in data
    public FileStatus[] getStatus(String path){
        FileStatus[] fileStatuses =null;
        try {
            fileStatuses = hdfs.listStatus(new Path(path));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return  fileStatuses;
    }
    //
    public boolean exist(String path){
        setConf();
        log.info("file exist: " + path);
        Path localPath = new Path(path);
        try {
            if (hdfs.exists(localPath)) {
                hdfs.close();
                return true;
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }
}
