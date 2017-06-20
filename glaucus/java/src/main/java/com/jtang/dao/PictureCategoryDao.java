package com.jtang.dao;

import com.jtang.entity.PicCategory;
import com.jtang.entity.PicFile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * FileInfo mongo auto dao
 *
 */
@Repository
public interface PictureCategoryDao extends MongoRepository<PicCategory, String> {

    public PicCategory findById(String id);

    public List<PicCategory> findByPicFileId(String picFileId);



}
