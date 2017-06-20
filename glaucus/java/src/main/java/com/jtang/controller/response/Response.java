package com.jtang.controller.response;

import lombok.Data;

/**
 * response
 * Created by lucas on 2016/11/10.
 */
@Data
public class Response {
    private final Long timestamp = System.currentTimeMillis();
    private int status;

    public Response(int status) {
        this.status = status;
    }
}
