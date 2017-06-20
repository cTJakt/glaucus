package com.jtang.dao;

import com.jtang.entity.DLModel;
import com.jtang.entity.Model;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * DLModel mongo repository
 * Created by lucas on 2017/6/18.
 */
@Repository
public interface DLModelDao extends MongoRepository<DLModel, String> {

    public List<DLModel> findByPicFileId(String picFileId);
    public DLModel findById(String modelId);
}
