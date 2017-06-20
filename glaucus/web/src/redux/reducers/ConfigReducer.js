import {UPDATE_ALL_CONFIG,CHANGE_CONFIG,CHANGE_FILE,CHANGE_CONFIGID,CHANGE_AFTER_ADD,CHANGE_ADD_ID,INIT_INFO,CHANGE_CONFIG_PAGE,CHANGE_CONFIG_PAGE_SPIN,INIT_CONFIG_INFO,UPDATE_LIST_INFO,
    UPDATE_CONFIG_INFO} from '../actions/Config'
// import {GET_FILE,GET_FEATURE,FILE_SELECT, UPDATE_CONFIG,UPDATE_MODEL,
//     FEATURE_CHANGE,CHANGE_MODEL_TYPE,CHANGE_STEP,GET_MODEL,UPDATE_MODEL_INFO,ADD_MODEL_ARGS,UPDATE_EDIT_TRUE,
//     UPDATE_WHEN_CHANGE,UPDATE_ARG_VALUE} from '../actions/AddConfigAction'
/**
 * Created by LXY on 2017/3/17.
 */
const initialState = {
    configs:[],
    fileId:'',
    fileName:'',
    configId:'',
    configName:'',
    featureList:[],
    modelDetail:[],
    modelData:[],
    openKeys:[],
    modelTypeName:"",
    addConfigId:null,    //需要传递给addConfig界面的id
    currentConfigPage:1,
    configPageSpin:false,
    configArrays:[],        //所有的配置信息，包含文件id，文件名，配置id和配置名
    configInfo:null,        //一个配置的所有信息
};


export default (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case UPDATE_ALL_CONFIG:
            return Object.assign({},state,{
                configs:action.configs,
                fileId:action.fileId,
                fileName:action.fileName,
                configId:action.configId,
                configName:action.configName,
                featureList:action.featureList,
                modelDetail:action.modelDetail,
                modelData:action.modelData,
                openKeys:action.openKeys,
                modelTypeName:action.modelTypeName,
                configPageSpin:false,
            });
        case CHANGE_CONFIG:
            return Object.assign({},state,{
                fileId:action.fileId,
                fileName:action.fileName,
                configId:action.configId,
                configName:action.configName,
                featureList:action.featureList,
                modelData:action.modelData
            });
        case CHANGE_FILE:
            return Object.assign({},state,{
                openKeys:action.openKeys
            });
        case CHANGE_CONFIGID:
            return Object.assign({},state,{
                configId:action.configId
            });

        case CHANGE_AFTER_ADD:
            return Object.assign({},state,{
                configs:action.configs,
                fileId:action.fileId,
                fileName:action.fileName,
                configId:action.configId,
                configName:action.configName,
                featureList:action.featureList,
                modelDetail:action.modelDetail,
                modelData:action.modelData,
                openKeys:action.openKeys,
                modelTypeName:action.modelTypeName
            });
        case CHANGE_ADD_ID:
            return Object.assign({},state,{
                addConfigId:action.addConfigId,
            });
        case CHANGE_CONFIG_PAGE:
            return Object.assign({},state,{
                currentConfigPage:action.currentConfigPage,
            });
        case CHANGE_CONFIG_PAGE_SPIN:
            return Object.assign({},state,{
                configPageSpin:action.configPageSpin,
            });
        case INIT_INFO:
            // return Object.assign({},state,{
            //     addConfigId:null,
            // });
            return initialState;
        case INIT_CONFIG_INFO:
            return Object.assign({},state,{
                configArrays:action.configArrays,
                configInfo:action.configInfo,
                fileId:action.fileId,
                configId:action.configId,
                configPageSpin:false,
                fileName:action.fileName,
                openKeys:[action.fileId],
                configName:action.configName,
            });
        case UPDATE_LIST_INFO:
            return Object.assign({},state,{
                configArrays:action.configArrays,
                configInfo:action.configInfo,
                fileId:action.fileId,
                configId:action.configId,
                fileName:action.fileName,
                configPageSpin:false,
                openKeys:[action.fileId],
                configName:action.configName,
            });
        case UPDATE_CONFIG_INFO:
            return Object.assign({},state,{
                configInfo:action.configInfo,
                configId:action.configId,
                fileName:action.fileName,
                configPageSpin:false,
                configName:action.configName,
            });
        default:
            return state;
    }
}
