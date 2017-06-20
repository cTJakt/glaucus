package com.jtang.controller;

import com.jtang.controller.response.ErrorRes;
import com.jtang.controller.response.NormalRes;
import com.jtang.controller.response.Response;
import com.jtang.entity.Config;
import com.jtang.services.ConfigService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by twenbo on 2016/11/16.
 * Changed by lucas on 2017/04/24.
 */

@Slf4j
@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Autowired
    private ConfigService configService;

    /**
     *
     * @param config
     * @return
     */
    @PostMapping(value = "/add")
    public Response addConfig(@RequestBody Config config){
        try {
            String rsl = configService.addConfig(config);
            return rsl != null? new NormalRes(rsl) : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param userId
     * @return
     */
    @GetMapping(value = "/get/all")
    public Response getAllConfig(@RequestParam(value="userId", required = false) String userId){
        try{
            return new NormalRes(configService.getAllConfigs(userId));
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param userId
     * @return
     */
    @GetMapping(value = "/get/all_new")
    public Response getAllConfig_new(@RequestParam(value="userId", required = false) String userId){
        try{
            return new NormalRes(configService._getAllConfigsByUserId(userId));
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param configId
     * @return
     */
    @GetMapping(value = "/get/one/config")
    public Response getOneConfig(@RequestParam(value="configId", required = false) String configId){
        try{
            return new NormalRes(configService.getConfigInfoByConfigId(configId));
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ErrorRes();
        }
    }



    /**
     *
     * @param configId
     * @param confName
     * @param trainFeatureList
     * @return
     */
    @GetMapping(value = "/change")
    public Response changeConfig(@RequestParam(value="configId", required = false) String configId,
                                 @RequestParam(value="confName") String confName,
                                 @RequestParam(value="trainFeatureList") List<String> trainFeatureList) {
        try{
            boolean rsl = configService.changeConfig(configId, confName, trainFeatureList);
            return rsl? new NormalRes() : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    @GetMapping(value="/delete")
    public Response deleteModelByModelId(@RequestParam(value="configId", required = false) String configId){
        try {
            return new NormalRes(configService.deleteConfigById(configId));
        }catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param fileId
     * @param fieldName
     * @return
     */
    @GetMapping(value="/get/features")
    public Response getFeatureSelection(@RequestParam(value="fileId", required = false) String fileId,
                                        @RequestParam(value="fieldName", required = false) String fieldName) {
        try {
            return new NormalRes(configService.getSelectedFeature(fileId, fieldName));
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }
}
