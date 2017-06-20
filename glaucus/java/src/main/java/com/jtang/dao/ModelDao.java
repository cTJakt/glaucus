package com.jtang.dao;

import com.jtang.entity.Model;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by LXY on 2016/11/14.
 */
@Repository
public interface ModelDao extends MongoRepository<Model, String> {

    public List<Model> findByFileInfoId(String fileInfoId);
    public List<Model> findByConfigId(String configId);
    public Model findById(String modelId);
}
