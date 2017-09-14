package com.jtang.services.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * return login object
 * Created by lucas on 2016/11/13.
 */
@Data
@AllArgsConstructor
public class LoginPojo {
    private boolean loginStatus;
    private String userId;
    private String jwtToken;
}
