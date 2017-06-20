package com.jtang.dao;

import com.jtang.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * User mongo auto dao
 * Created by lucas on 2016/10/13.
 */
@Repository
public interface UserDao extends MongoRepository<User, String> {
    public User findByUsername(String username);
}
