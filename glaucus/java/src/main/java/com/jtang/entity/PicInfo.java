package com.jtang.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.Date;

/**
 * Created by twb on 2017/6/1.
 */

@Data
public class PicInfo {


    @Id
    private String id;

    //.pic location
    private String location;
    //create time
    private Date uploadTime;

    //filename
    private String picname;

    private String tag;

    private String categoryId;

    public PicInfo() {}

    public PicInfo(String location, String picname, String tag, String categoryId) {
        this.location = location;
        this.picname = picname;
        this.uploadTime = new Date();
        this.tag = tag;
        this.categoryId = categoryId;
    }
    //for the scala use
    public String getId() {
        return id;
    }
    public String getLocation() {
        return location;
    }
    public String getPicname() {return picname;}
    public String getTag(){return tag;}

}
