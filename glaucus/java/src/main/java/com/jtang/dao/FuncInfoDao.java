package com.jtang.dao;


import com.jtang.entity.FuncInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Administrator on 2017/4/12.
 */
@Repository
public interface FuncInfoDao extends MongoRepository<FuncInfo, String> {

    public FuncInfo findById(String Id);

}
