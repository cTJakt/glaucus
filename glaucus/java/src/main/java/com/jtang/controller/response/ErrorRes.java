package com.jtang.controller.response;

import lombok.Data;
import org.springframework.http.HttpStatus;

/**
 *
 * Created by lucas on 2016/11/13.
 */
@Data
public class ErrorRes extends Response{
    private int errorCode;
    private String msg;

    public ErrorRes() {
        super(HttpStatus.BAD_REQUEST.value());
        this.errorCode = 40000;
    }

    /**
     *
     * @param errorCode
     * @param msg
     * 40000: Unknown error
     * 40001: NullPointer exception
     * 40002: Server error
     */
    public ErrorRes(int errorCode, String msg) {
        this();
        this.errorCode = errorCode;
        this.msg = msg;
    }

}
