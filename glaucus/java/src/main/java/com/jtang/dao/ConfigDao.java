package com.jtang.dao;

import com.jtang.entity.Config;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by LXY on 2016/11/14.
 */
@Repository
public interface ConfigDao extends MongoRepository<Config, String> {

    public Config findById(String id);
    public List<Config> findByFileInfoId(String fileInfoId);
    public  List<Config> findByUserId(String userid);


}
