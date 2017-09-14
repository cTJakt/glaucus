package com.jtang.services;

import com.jtang.dao.UserDao;
import com.jtang.entity.User;
import com.jtang.services.pojo.LoginPojo;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;


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

        String jwtToken="";  //保存jwt token秘钥
        jwtToken = Jwts.builder().setSubject(username).claim("roles", "user").setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, "secretkey").compact();
        return new LoginPojo(equals, equals ? user.getId() : null,jwtToken);
    }

    public boolean addUser(User user){
        User test = userDao.findByUsername(user.getUsername());
        if(test==null) {
            userDao.save(user);
            return true;
        }
        else        //已经存在该用户名的用户则添加失败
            return false;
    }

}
