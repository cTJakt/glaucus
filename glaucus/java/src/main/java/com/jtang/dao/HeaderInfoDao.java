package com.jtang.dao;

import com.jtang.entity.HeaderInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by lucas on 2016/11/15.
 *
 */
@Repository
public interface HeaderInfoDao extends MongoRepository<HeaderInfo, String>{
    public HeaderInfo findById(String id);
    public List<HeaderInfo> findByFileInfoId(String fileInfoId);
    public List<HeaderInfo> findByFieldNameAndFileInfoId(String fieldName, String fileInfoId);
}
