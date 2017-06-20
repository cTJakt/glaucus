package com.jtang.dao;

import com.jtang.entity.PicFile;
import com.jtang.entity.PicInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * FileInfo mongo auto dao
 *
 */
@Repository
public interface PictureFileDao extends MongoRepository<PicFile, String> {

    public PicFile findById(String id);

    public List<PicFile> findByUserId(String userId);  //find all files which belongs one user



}
