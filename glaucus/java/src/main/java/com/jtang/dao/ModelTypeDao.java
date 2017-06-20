package com.jtang.dao;

import com.jtang.entity.ModelType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by LXY on 2016/11/14.
 */
@Repository
public interface ModelTypeDao  extends MongoRepository<ModelType, String> {

    public ModelType findById(String Id);

    public List<ModelType> findByModelTypeName(String modelTypeName);


    public ModelType findByModelTypeNameAndModelDetailName(String modelTypeName,String specialModelName);
}
