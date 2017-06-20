package com.jtang.services;

import com.jtang.dao.FuncInfoDao;
import com.jtang.entity.FuncInfo;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by Administrator on 2017/4/12.
 */
@Slf4j
@Component
@Data
public class FuncInfoService {
    @Autowired
    FuncInfoDao funcInfoDao;
    public List<FuncInfo> getAllFuncInfos(){
        return funcInfoDao.findAll();
    }
}
