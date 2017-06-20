package com.jtang.services;

import com.jtang.dao.UserDao;
import com.jtang.entity.User;
import com.jtang.services.pojo.LoginPojo;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


/**
 * Deal with the login logistic
 * Created by lucas on 2016/11/13.
 */
@Slf4j
@Component
@Data
public class LoginService {
    @Autowired private UserDao userDao;

    public LoginPojo verifyUser(String username, String password) throws Exception {
        log.info("User login: {username: " + username + ", password: " + password + "}");
        User user = userDao.findByUsername(username);
        boolean equals = user.getPassword().equals(password);
        return new LoginPojo(equals, equals ? user.getId() : null);
    }

}
