package com.jtang.dao;

import com.jtang.entity.PicInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * FileInfo mongo auto dao
 *
 */
@Repository
public interface PictureInfoDao extends MongoRepository<PicInfo, String> {

    public PicInfo findById(String id);

    public List<PicInfo> findByCategoryId(String categoryId);

}
