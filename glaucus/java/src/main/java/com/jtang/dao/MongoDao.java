package com.jtang.dao;

import com.jtang.config.AppConfig;
import com.jtang.entity.FileInfo;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by LXY on 2016/10/25.
 */
public class MongoDao {

    @Autowired
    AppConfig appConfig;

    //connect to hdfs
    FileSystem hdfs;
    Configuration conf = new Configuration();
    //String hdfsUri = appConfiguration.getHdfsServerAddr();
    String hdfsUri = "hdfs://192.168.0.119:9000/";
    String hdfsRootPath = "/data/cloudkits";   //this is the directory which we used to store hdfs files

    //set the  configuration and get connection
    private void setConf(){
        conf.set("fs.defaultFS", hdfsUri);
        try {
            hdfs = FileSystem.get(conf);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    //modify the hdfs filename
    public boolean updateFileName(FileInfoDao fileInfoDaoRepository, FileInfo fileInfo){
        setConf();
        String id = fileInfo.getId();
        FileInfo oldFileInfo1 = fileInfoDaoRepository.findOne(id);
        String oldPath = oldFileInfo1.getLocation();
        String newPath = fileInfo.getLocation();
        boolean isSuccess = false;
        try {
            isSuccess = hdfs.rename(new Path(oldPath),new Path(newPath));
            fileInfoDaoRepository.save(fileInfo);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return isSuccess;
    }

    //find all files in HDFS belongs a user
    public List<FileInfo> findAllFilesInHdfs(FileInfoDao fileInfoDaoRepository, String userId){
        List<FileInfo> fileInfoList = new ArrayList<FileInfo>();
        fileInfoList = fileInfoDaoRepository.findByUserId(userId);
        return fileInfoList;
    }

    //find one file's location
    public FileInfo findOneFileInHdfs(FileInfoDao fileInfoDaoRepository, String userId, String fileName){
        setConf();
        FileInfo fileInfo = new FileInfo();
        fileInfo = fileInfoDaoRepository.findByUserIdAndFilename(userId,fileName);    //find the
        return fileInfo;
    }

    //delete files in hdfs
    // tyep = true, delete the directory
    // type = false, delete the file
    public void deleteFile(FileInfoDao fileInfoDaoRepository, FileInfo fileInfo, boolean type){
        setConf();
        String hdfsPath = fileInfo.getLocation();
        try {
            hdfs.delete(new Path(hdfsPath),type);
        } catch (IOException e) {
            e.printStackTrace();
        }
        fileInfoDaoRepository.delete(fileInfo);
    }
}
