import {GET_FILE,GET_FEATURE,FILE_SELECT, UPDATE_CONFIG,UPDATE_MODEL,
    FEATURE_CHANGE,CHANGE_MODEL_TYPE,CHANGE_STEP,GET_MODEL,UPDATE_MODEL_INFO,ADD_MODEL_ARGS,UPDATE_EDIT_TRUE,CHANGE_FEATURE_SPIN,SELECT_METHOD,
    UPDATE_WHEN_CHANGE,UPDATE_ARG_VALUE,DO_INIT,CHANGE_SELECT_WAY,AUTO_GET_FEATURES,CHANGE_BTN_STATE,SELECT_FIELDS} from '../actions/AddConfigAction'
/**
 * Created by LXY on 2017/3/19.
 */
const initialState = {
    files:[],
    selectFile:null,
    featureList:[],
    targetKeys:[],
    modelType:'classification',
    trainFeatureList:[],
    stepCurrent:0,
    configId:"",
    confName:"",
    // arguments:null,
    featureSelectDataReady:false,
    modelSelectDataReady:false,
    modelName:null,
    modelTypeId: null,
    modelDetailName: null,
    modelDetailDes:"未选择",
    fileId:"",
    models:[],
    modelArguments:"",
    modelTypeName:"",
    modelDes:"",
    modelId:"",
    featureSelectWay:"selfSelect",  //分类时特征选择方式,默认手动选择
    objectFeature:"",
    btnLoading:false,
    featureSpinLoading:false,
    methodId:"ChiSqSelector",        //特征工程的方法id
    featureResult:[],       //RL和RF 特征工程返回的结果值
    objectField:null,         //全自动训练时，选择的目标字段
};

export default (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case GET_FILE:
            return Object.assign({},state,{
                files:action.files
            });
        case GET_FEATURE:
            return Object.assign({},state,{
                featureList:action.featureList,
                fileId:action.fileId,
                targetKeys:[],
                objectField:null,
            });
        case FILE_SELECT:
            return Object.assign({},state,{
                fileId:action.fileId,
                objectField:null,
            });
        case UPDATE_CONFIG:
            return Object.assign({},state,{
                featureSelectDataReady: action.featureSelectDataReady,
                fileId: action.fileId,
                modelTypeName: action.modelTypeName,
                confName: action.confName,
                trainFeatureList: action.trainFeatureList,
            });
        case UPDATE_MODEL:
            return Object.assign({},state,{
                modelSelectDataReady: action.modelSelectDataReady,
                modelName: action.modelName,
                modelTypeId: action.modelTypeId,
                modelDetailName: action.modelDetailName,
                modelArguments: action.modelArguments
            });
        case FEATURE_CHANGE:
            return Object.assign({},state,{
                targetKeys:action.targetKeys,
                objectFeature:action.targetKeys[action.targetKeys.length-1],
                trainFeatureList:action.targetKeys
            });
        case CHANGE_MODEL_TYPE:
            return Object.assign({},state,{
                modelType:action.modelType,
                targetKeys:[]
            });
        case CHANGE_STEP:
            return Object.assign({},state,{
                stepCurrent:action.stepCurrent
            });
        case GET_MODEL:
            return Object.assign({},state,{
                modelTypeName: action.modelTypeName,
                modelDes: action.modelDes,
                models: action.models
            });
        case UPDATE_MODEL_INFO:
            return Object.assign({},state,{
                modelArguments: action.modelArguments
            });
        case ADD_MODEL_ARGS:
            return Object.assign({},state,{
                modelArguments: action.modelArguments
            });
        case UPDATE_WHEN_CHANGE:
            return Object.assign({},state,{
                modelDetailName: action.modelDetailName,
                modelDetailDes: action.modelDetailDes,
                // arguments: args,
                modelArguments: action.modelArguments,
                modelId:action.modelId
            });
        case UPDATE_EDIT_TRUE:
            return Object.assign({},state,{
                modelArguments: action.modelArguments
            });
        case UPDATE_ARG_VALUE:
            return Object.assign({},state,{
                modelArguments: action.modelArguments
            });
        case CHANGE_SELECT_WAY:
            return Object.assign({},state,{
                featureSelectWay: action.featureSelectWay
            });
        case AUTO_GET_FEATURES:
            return Object.assign({},state,{
                targetKeys:action.targetKeys,
                objectFeature:action.targetKeys[action.targetKeys.length-1],
                trainFeatureList:action.targetKeys,
                btnLoading:false,
                featureSpinLoading:false,
                featureResult:action.featureResult
            });
        case CHANGE_BTN_STATE:
            return Object.assign({},state,{
                btnLoading:action.btnLoading
            });
        case CHANGE_FEATURE_SPIN:
            return Object.assign({},state,{
                featureSpinLoading:action.featureSpinLoading
            });
        case SELECT_METHOD:
            return Object.assign({},state,{
                methodId:action.methodId
            });
        case SELECT_FIELDS:
            return Object.assign({},state,{
                objectField:action.objectField
            });
        case DO_INIT:
            return initialState;
        default:
            return state;
    }
}