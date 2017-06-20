package com.jtang.services;

import com.jtang.dao.*;
import com.jtang.data.FitTestData;
import com.jtang.data.LibsvmAdapter;
import com.jtang.entity.DLModel;
import com.jtang.entity.Model;
import com.jtang.entity.ModelType;
import com.jtang.entity.PicFile;
import com.jtang.model.classification.*;
import com.jtang.model.cluster.KmeansCluster;
import com.jtang.model.regression.RFRegression;
import com.jtang.services.pojo.DLGeneralModelPojo;
import com.jtang.services.pojo.ModelPojo;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Config-related service
 * Created by twenbo on 2016/11/21.
 */
@Slf4j
@Data
@Component
public class ModelService {

    @Autowired
    private ConfigDao configDao;
    @Autowired
    private FileInfoDao fileInfoDao;
    @Autowired
    private PictureFileDao pictureFileDao;
    @Autowired
    private ModelDao modelDao;
    @Autowired
    private ModelTypeDao modelTypeDao;
    @Autowired
    private DLModelDao dlModelDao;
    @Autowired
    private HeaderInfoDao headerInfoDao;
    @Autowired
    private LibsvmAdapter libsvmAdapter;
    @Autowired
    private DTClassification dtClassification;
    @Autowired
    private LRClassification lrClassification;
    @Autowired
    private RFClassification rfClassification;
    @Autowired
    private GDBTClassification gdbtClassification;
    @Autowired
    private KmeansCluster kmeansCluster;

    @Autowired
    private MulPerClassification mulPerClassification;
    @Autowired
    private NaiveBayesClassification naiveBayesClassification;

    @Autowired
    private RFRegression rfRegression;

    @Autowired
    private FitTestData fitTestData;
    @Autowired
    private FileService fileService;
    /**
     *
     * @param model
     * @return
     */

    public String addModel(Model model){

        /*Model modelInfo = new Model();
        modelInfo.setFileInfoId(fileId);
        modelInfo.setConfigId(configId);
        modelInfo.setModelName(modelTypeName);
        modelInfo.setModelTypeId(modelTypeId);*/
        model.setTrained(false);
        model.setResOfModel(null);
        model.setModelPath(null);
        return modelDao.save(model).getId();
    }
    public String addDlModel(DLModel model) {
        model.setTrained(false);
        model.setResOfModel(null);
        model.setModelPath(null);
        return dlModelDao.save(model).getId();
    }
    /**
     *
     * @param userId
     * @return
     */
    public List<ModelPojo> getAllModelByUserId(String userId){

        val rsl = configDao.findByUserId(userId).stream().map((config) -> {
            String configId = config.getId();
            String configName = config.getConfName();
            //val modelAllConfig = new ArrayList<ModelPojo>();
            List modelPerConfig = modelDao.findByConfigId(configId).stream().map((model) -> {
                ModelType modelType =  modelTypeDao.findById(model.getModelTypeId());
                int flag = -1;
                if(model.isTrained() && model.getResOfModel()!=null){
                    flag = 1;
                }else if(model.isTrained() && model.getResOfModel()==null){
                    flag = 0;
                }else{
                    flag = -1;
                }
                return new ModelPojo(configId,
                        configName,
                        model.getModelTypeId(),
                        modelType != null ? modelType.getModelTypeName() : "",
                        modelType != null ? modelType.getModelDetailName() : "",
                        modelType != null ? modelType.getModelDetailDes() : "",
                        modelType != null ? modelType.getModelDes() : "",
                        model.getId(),
                        model.getModelName(),
                        flag,
                        model.getArguments(),
                        model.getResOfModel());
                }).collect(Collectors.toList());
            return modelPerConfig;
        }).reduce(new ArrayList<>(), (listA, listB) -> {
            listA.addAll(listB);
            return listA;
        });
        return rsl;
    }

    /**
     *
     * @param userId
     * @return
     */
    public List<DLGeneralModelPojo> getAllGeneralModelByUserId(String userId){
        List<PicFile> picFiles = pictureFileDao.findByUserId(userId);
        val result = picFiles.stream().map(picFile -> {
            List<DLModel> dlModels = dlModelDao.findByPicFileId(picFile.getId());
            return dlModels.stream()
                    .map(dlModel -> new DLGeneralModelPojo(dlModel.getId(), dlModel.getModelName(), picFile.getId(), picFile.getFileName()))
                    .collect(Collectors.toList());
        }).reduce(new ArrayList<>(), (listA, listB) -> {
            listA.addAll(listB);
            return listA;
        });
        return result;
    }

    public DLModel getDLModelDetailById(String modelId) {
        return dlModelDao.findById(modelId);
    }

    /**
     *
     * @param modelTypeName
     * @return
     */
    public List<ModelType> getModelTypeByModelTypeName(String modelTypeName) {
        return modelTypeDao.findByModelTypeName(modelTypeName);
    }

    /**
     *
     * @param modelId
     * @param modelName
     * @param modelTypeId
     * @return
     */
    public boolean changeModel(String modelId, String modelName, String modelTypeId){

        Model model = new Model();
        model.setId(modelId);
        model.setModelName(modelName);
        model.setModelTypeId(modelTypeId);
        val modelObject = modelDao.save(model);
        if(modelObject != null)
            return true;
        return false;
    }

    /**
     *change status of isTrained
     * @param modelId
     * @return
     */
    public boolean changeStatusOfTrained(String modelId, boolean trained){

        Model model =  modelDao.findById(modelId);
        model.setTrained(trained);
        val modelObject = modelDao.save(model);
        return modelObject != null;
    }

    /**
     *
     * @param modelId
     * @param resOfModel
     * @param model
     * @return
     */
    public boolean updataResOfModel(String modelId, HashMap<String, String> resOfModel, Object model){
        Model modelOfGet =  modelDao.findById(modelId);
        //T.B.D.
        //modelOfGet.setModel(model);
        modelOfGet.setResOfModel(resOfModel);
        modelOfGet.setTrained(true);
        val modelObject = modelDao.save(modelOfGet);
        if(modelObject != null)
            return true;
        return false;
    }



    public boolean trainTheModel(String modelId) throws Exception{
        //change training flag to true


        changeStatusOfTrained(modelId, true);

        val trainingModel = modelDao.findById(modelId);
        val modelType1 = modelTypeDao.findById(trainingModel.getModelTypeId());
        val configInfo = configDao.findById(trainingModel.getConfigId());
        val features = configInfo.getFieldIds().stream().map(fieldId ->
                headerInfoDao.findById(fieldId).getFieldName()
        ).collect(Collectors.toList());

        //1. transfer file to libsvm
        log.info("Transfer to LibSVM...");
        String keyFeature = features.get(features.size()-1);
        System.out.println(keyFeature);
        features.remove(features.size()-1);
        val featureNum = features.size();
        String libsvm = libsvmAdapter.parquet2Libsvm(configInfo.getFileInfoId(), keyFeature, features.toArray(new String[features.size()]));

        String modelDetailName = modelType1.getModelDetailName();
        System.out.println(modelDetailName);
        val modelArguments = trainingModel.getArguments();
        boolean rsl = false;
        try {
            switch (modelDetailName) {
                case "LogisticRegression":
            /*
            * maxIter: Int,
                 regParam: Float,
                 elasticNetParam: Float
            * */
                    val lrModel = lrClassification.lrTraining(libsvm,
                            Integer.parseInt(modelArguments.get("MaxIter")),
                            Float.parseFloat(modelArguments.get("RegParam")),
                            Float.parseFloat(modelArguments.get("ElasticNetParam")));
                    val lrRst = lrClassification.lrResult(lrModel);

                    rsl = updataResOfModel(modelId, lrRst, lrModel);
                    break;
                case "DecisionTree":
            /*
            * maxIter: Int,
                 regParam: Float,
                 elasticNetParam: Float
            * */
                    val dtModel = dtClassification.dtTraining(libsvm,
                            Integer.parseInt(modelArguments.get("Category")),
                            Float.parseFloat(modelArguments.get("TrainingSetOccupy")));
                    val dtResult = dtClassification.dtResult(dtModel, modelId);

                    rsl = updataResOfModel(modelId, dtResult, dtModel);
                    break;
                case "RandomForest":
                    /*
                * maxIter: Int,
                 regParam: Float,
                 elasticNetParam: Float
            * */

                    val rfModel = rfClassification.dtTraining(libsvm,
                            Integer.parseInt(modelArguments.get("Category")),
                            Float.parseFloat(modelArguments.get("TrainingDataSetOccupy")));
                    val rfResult = rfClassification.dtResult(rfModel, modelId);

                    rsl = updataResOfModel(modelId,rfResult,rfModel);
                    break;
                case "GBDT":
                    /*
                * maxIter: Int,
                 regParam: Float,
                 elasticNetParam: Float
            * */

                    val gbtModel = gdbtClassification.dtTraining(libsvm,
                            Integer.parseInt(modelArguments.get("Category")),
                            Float.parseFloat(modelArguments.get("TrainingDataSetOccupy")));
                    val gbtResult = gdbtClassification.dtResult(gbtModel, modelId);

                    rsl = updataResOfModel(modelId,gbtResult,gbtModel);
                    break;
                case "K-Means":

                    val kmeansModel = kmeansCluster.dtTraining(libsvm,
                            Integer.parseInt(modelArguments.get("NumOfCluster")),
                            Integer.parseInt(modelArguments.get("Seed")));
                    val kmeansResult = kmeansCluster.dtResult(kmeansModel);
                    rsl = updataResOfModel(modelId,kmeansResult,kmeansModel);
                    System.out.println(rsl);
                    break;
                case "MultilayerPerceptronClassifier":

                    val mlpc = mulPerClassification.dtTraining(libsvm,
                            Integer.parseInt(modelArguments.get("Category")),
                            Float.parseFloat(modelArguments.get("TrainingDataSetOccupy")), featureNum);
                    val mlpcResult = mulPerClassification.dtResult(mlpc, modelId);

                    rsl = updataResOfModel(modelId,mlpcResult,mlpc);
                    break;
                case "NaiveBayes":

                    val nby = naiveBayesClassification.dtTraining(libsvm,
                            Integer.parseInt(modelArguments.get("Category")),
                            Float.parseFloat(modelArguments.get("TrainingDataSetOccupy")));
                    val nbyResult = naiveBayesClassification.dtResult(nby, modelId);

                    rsl = updataResOfModel(modelId,nbyResult,nby);
                    break;

                case "RandomForestRegression":

                    val rfReg = rfRegression.dtTraining(libsvm,
                            Integer.parseInt(modelArguments.get("Category")),
                            Float.parseFloat(modelArguments.get("TrainingDataSetOccupy"))
                            );
                    val rfRegResult = rfRegression.dtResult(rfReg);

                    rsl = updataResOfModel(modelId,rfRegResult,rfReg);

                    break;
                default:
                    rsl = false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            changeStatusOfTrained(modelId, false);
        }
        if (!rsl) changeStatusOfTrained(modelId, false);
        return rsl;
    }

    /**
     *
     * @param modelId
     */

    public boolean deleteModel(String modelId) {
        Model model =  modelDao.findById(modelId);
        if(model == null)
            return false;
        modelDao.delete(modelId);
        return true;

    }
    public List<Map<String, String>> useModel(String fileId, String modelId) throws Exception{
         //return fitTestData.transformData("58f5804a98c83e1ac842f8c8","5900503498c83e228813cc8f");
        val res = fitTestData.transformData(fileId,modelId);
        fileService.deleteFile(fileId);
        return res;
    }

    /*
    public static void main(String[] args) throws Exception {
        ModelService modelService = new ModelService();
        modelService.deleteModel("584a654f03c1c33dc46c635e");
    }*/

}
