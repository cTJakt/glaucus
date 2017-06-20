package com.jtang.dao;

import com.jtang.entity.Test;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Test mongo auto dao
 * Created by lucas on 2016/10/12.
 */
public interface TestDao extends MongoRepository<Test, String>{
    public Test findByName(String name);
    public List<Test> findByGender(String gender);
}
