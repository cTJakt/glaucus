package com.jtang.services;

import com.jtang.analysis.FeatureProject;
import com.jtang.dao.*;
import com.jtang.entity.Config;
import com.jtang.entity.HeaderInfo;
import com.jtang.entity.Model;
import com.jtang.entity.ModelType;
import com.jtang.services.pojo.ConfigDetilePojo;
import com.jtang.services.pojo.ConfigModelPojo;
import com.jtang.services.pojo.ConfigPojo;
import com.jtang.services.pojo._ConfigPojo;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Config-related service
 * Created by twenbo on 2016/11/16.
 * Changed by lucas on 2016/11/18.
 */
@Slf4j
@Component
@Data
public class ConfigService {

    @Autowired private ConfigDao configDao;
    @Autowired private FileInfoDao fileInfoDao;
    @Autowired private ModelTypeDao modelTypeDao;
    @Autowired private HeaderInfoDao headerInfoDao;
    @Autowired private ModelDao modelDao;
    @Autowired private FeatureProject featureProject;

    /**
     *
     * @param config
     * @return
     */

    public String addConfig(Config config){

        /*Config configInfo = new Config();
        configInfo.setFileInfoId(fileId);
        configInfo.setUserId(userId);
        configInfo.setModelTypeId(modelTypeId);
        configInfo.setConfName(confName);
        configInfo.setFieldIds(trainFeatureList);*/
        val configId = configDao.save(config).getId();

        return configId;
    }

    /**
     *
     * @param userId
     * @return
     */
    public List<ConfigPojo> getAllConfigs(String userId){

        val rsl = configDao.findByUserId(userId).stream().map((config) -> {
            String fileName = fileInfoDao.findById(config.getFileInfoId()).getFilename();
            String modelTypeName = modelTypeDao.findById(config.getModelTypeId()) == null ? "" :
                    modelTypeDao.findById(config.getModelTypeId()).getModelTypeName();
            ConfigPojo configPojo = new ConfigPojo(config.getFileInfoId(),
                    fileName,
                    config.getId(),
                    config.getModelTypeId(),
                    modelTypeName,
                    config.getConfName(),
                    config.getFieldIds().stream().map(fieldId ->
                            headerInfoDao.findById(fieldId)
                    ).collect(Collectors.toList()));
            return configPojo;
        }).collect(Collectors.toList());
        return rsl;
    }


    /**
     *
     * @param userId
     * @return
     */
    public List<_ConfigPojo> _getAllConfigsByUserId(String userId){

        val rsl = configDao.findByUserId(userId).stream().map((config) -> {
            String fileName = fileInfoDao.findById(config.getFileInfoId()).getFilename();
            _ConfigPojo configPojo = new _ConfigPojo(config.getFileInfoId(),
                    fileName,
                    config.getId(),
                    config.getConfName());
            return configPojo;
        }).collect(Collectors.toList());
        return rsl;
    }

    /**
     *
     * @param configId
     * @return
     */
    public ConfigDetilePojo getConfigInfoByConfigId(String configId){
        List<ConfigModelPojo> modelInfos=new ArrayList<>();
        List<Model> models=modelDao.findByConfigId(configId);
        String modelTypeName="";
        String modelTypeDes="";
        String modelTypeId="";
        for(int i=0;i<models.size();i++){
            Model model=models.get(i);
            ModelType modelType=modelTypeDao.findById(model.getModelTypeId());
            int flag = -1;
            if(model.isTrained() && model.getResOfModel()!=null){
                flag = 1;
            }else if(model.isTrained() && model.getResOfModel()==null){
                flag = 0;
            }else{
                flag = -1;
            }
            modelInfos.add(new ConfigModelPojo(
                    model.getModelName(),modelType==null?"自动训练":modelType.getModelDetailName(),flag
            ));
            modelTypeId=modelType==null?"":modelType.getId();
            modelTypeName=modelType==null?"dl":modelType.getModelTypeName();
            modelTypeDes=modelType==null?"":modelType.getModelDes();
        }

        val config = configDao.findById(configId);
//        String modelTypeName = modelTypeDao.findById(config.getModelTypeId()) == null ? "" :
//                modelTypeDao.findById(config.getModelTypeId()).getModelTypeName();
//        String modelTypeDes = modelTypeDao.findById(config.getModelTypeId()) == null ? "" :
//                modelTypeDao.findById(config.getModelTypeId()).getModelDes();
        String modelDetileDes = modelTypeDao.findById(config.getModelTypeId()) == null ? "" :
                modelTypeDao.findById(config.getModelTypeId()).getModelDetailDes();
        ConfigDetilePojo configPojo = new ConfigDetilePojo(
                config.getId(),
                modelTypeId,
                modelTypeName,
                modelTypeDes,
                modelDetileDes,
                config.getFieldIds().stream().map(fieldId ->
                        headerInfoDao.findById(fieldId)
                ).collect(Collectors.toList()),
                modelInfos);
        return configPojo;
    }


    /**
     *
     * @param configId
     * @param confName
     * @param trainFeatureList
     * @return
     */
    public boolean changeConfig(String configId, String confName, List<String> trainFeatureList){

        Config configInfo = new Config();
        configInfo.setId(configId);
        configInfo.setConfName(confName);
        configInfo.setFieldIds(trainFeatureList);
        val configObject_get = configDao.save(configInfo);

        return configObject_get != null;
    }

    public boolean deleteConfigById(String configId){

        Config configInfo = configDao.findById(configId);
        if(configInfo == null)
            return false;
        List<Model> modelList = modelDao.findByConfigId(configId);
        if(modelList!=null){
            for(Model model:modelList) {
                modelDao.delete(model);
            }
        }
        configDao.delete(configId);
        return true;
    }
    public List<HeaderInfo> getSelectedFeature(String fileId, String fieldName) {
        log.info("FeatureSelector: ", fileId + ", " + fieldName);
        val res = featureProject.featureSelector(fileId, fieldName);
        System.out.println(res);
        return res;
    }
}
