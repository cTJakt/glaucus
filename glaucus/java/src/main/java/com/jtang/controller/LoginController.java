package com.jtang.controller;

import com.jtang.controller.response.ErrorRes;
import com.jtang.controller.response.NormalRes;
import com.jtang.controller.response.Response;
import com.jtang.entity.User;
import com.jtang.services.LoginService;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


/**
 * Login API
 * Created by lucas on 2016/11/13.
 */
@Slf4j
@RestController
@RequestMapping("/uerManage")
public class LoginController {
    @Autowired private LoginService loginService;
    /**
     *
     * @param username
     * @param password
     * @return checks
     */
    @GetMapping(value = "/login")
    public Response userLogin(@RequestParam(value="username", required = false) String username,
                              @RequestParam(value = "password", required = false) String password) {
        try {
            val rsl = loginService.verifyUser(username, password);
            return new NormalRes(rsl);
        } catch (NullPointerException e) {
            e.printStackTrace();
            return new ErrorRes(40001, "Username does not exist.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    @PostMapping(value = "/register")
    public Response register(@RequestBody User user){     //注册,先判断该用户名是否已经存在
        boolean res=loginService.addUser(user);
        if(res) return new NormalRes("add success");
        else return new ErrorRes(40002,"Uses already exsists");
    }
}
