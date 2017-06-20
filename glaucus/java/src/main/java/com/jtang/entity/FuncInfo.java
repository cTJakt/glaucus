package com.jtang.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

/**
 * Created by Administrator on 2017/4/12.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FuncInfo {
    @Id
    private String id;
    private String funcDes;
    private String funcName;
    private int flagOfType;//0--String, 1--Double, 2--all
    private int flagOfConOrDis;//0--con, 1--dis, 2--all

    public FuncInfo(String funcDes, String funcName, int flagOfType, int flagOfConOrDis) {
        this.funcName = funcName;
        this.funcDes = funcDes;
        this.flagOfType = flagOfType;
        this.flagOfConOrDis = flagOfType;
    }

    public FuncInfo(String id, int flagOfType, int flagOfConOrDis) {
        this.id = id;
        this.flagOfType = flagOfType;
        this.flagOfConOrDis = flagOfConOrDis;
    }


}
