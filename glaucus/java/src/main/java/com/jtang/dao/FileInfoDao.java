package com.jtang.dao;

import com.jtang.entity.FileInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * FileInfo mongo auto dao
 * Created by lucas on 2016/10/13.
 */
@Repository
public interface FileInfoDao extends MongoRepository<FileInfo, String> {
    public FileInfo findById(String id);

    public List<FileInfo> findByUserId(String userId);  //find all files which belongs one user

    //find the file used the userId and fileName
    public FileInfo findByUserIdAndFilename(String userId, String filename);

}
