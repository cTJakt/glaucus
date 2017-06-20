package com.jtang.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.HashMap;


/**
 * File Location Table
 * Created by lucas on 2016/10/13.
 */
@Data
public class FileInfo {

    @Id
    private String id;

    //.parquet file location
    private String location;
    //create time
    private Date uploadTime;
    //foreign key which connect to User table
    private String userId;
    //filename
    private String filename;
    //filename
    private String folder;
    //file structure
    private HashMap<String, String> fileStrucInfo;

    public FileInfo() {}

    public FileInfo(String location, String userId, String filename) {
        this.location = location;
        this.userId = userId;
        this.filename = filename;
        this.uploadTime = new Date();
    }
    //for the scala use
    public String getId() {
        return id;
    }
    public String getLocation() {
        return location;
    }
    public String getFilename() {return filename;}
    public void setFileStrucInfo(HashMap<String, String> fileStrucInfo)
    {
        this.fileStrucInfo = fileStrucInfo;
    }
}
