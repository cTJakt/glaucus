package com.jtang.controller.response;

import lombok.Data;
import org.springframework.http.HttpStatus;

/**
 * normal return
 * Created by lucas on 2016/11/13.
 */
@Data
public class NormalRes extends Response {
    private Object data;

    public NormalRes() {
        super(HttpStatus.OK.value());
    }
    public NormalRes(Object data) {
        super(HttpStatus.OK.value());
        this.data = data;
    }
}
