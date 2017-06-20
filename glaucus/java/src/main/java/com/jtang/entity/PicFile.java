package com.jtang.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

/**
 * Created by twb on 2017/6/6.
 */


@Data
public class PicFile {

    @Id
    private String id;
    //foreign key which connect to User table
    private String userId;

    private String fileName;

    private String loc;

    public PicFile(String userId, String fileName, String loc){
        this.userId = userId;
        this.fileName = fileName;
        this.loc = loc;
    }
}
