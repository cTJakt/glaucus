package com.jtang.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

/**
 * The User table entity
 * Created by lucas on 2016/10/13.
 */
@Data
public class User {
    @Id
    private String id;

    private String username;
    private String password;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
