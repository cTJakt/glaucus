import {CHANGE_MODEL,UPDATE_MODEL,CHANGE_CONFIG,CHANGE_MODEL_PAGE,CHANGE_MODAL_STATE,
    CHANGE_UPLOAD,GET_FILE_INFO,GET_FORECAST_RESULT,CHANGE_FORECAST_STATE,UPDATE_RESULT
} from '../actions/Model'
/**
 * Created by LXY on 2017/3/18.
 */
const initialState={
    models:[],
    configId:'',
    modelId:'',
    openKeys:[],
    currentModelPage:1,
    modalVisible:false,
    uploadLoading:false,
    fileId:"",
    fileInfo:[],
    fileName:"",
    btnSpin:false,
    forecastRes:[]
};

export default (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case UPDATE_MODEL:
            return Object.assign({},state,{
                models:action.models,
                configId:action.configId,
                modelId:action.modelId,
                openKeys:action.openKeys,
                fileId:"",
                fileInfo:[],
                fileName:"",
                forecastRes:[],
            });
        case CHANGE_MODEL:
            return Object.assign({},state,{
                modelId:action.modelId,
                fileId:"",
                fileInfo:[],
                fileName:"",
                forecastRes:[]
            });
        case CHANGE_CONFIG:
            return Object.assign({},state,{
                openKeys:action.openKeys
            });
        case CHANGE_MODEL_PAGE:
            return Object.assign({},state,{
                currentModelPage:action.currentModelPage
            });
        case CHANGE_MODAL_STATE:
            return Object.assign({},state,{
                modalVisible:action.modalVisible
            });
        case CHANGE_UPLOAD:
            return Object.assign({},state,{
                uploadLoading:action.uploadLoading
            });
        case GET_FILE_INFO:
            return Object.assign({},state,{
                fileId:action.fileId,
                fileInfo:action.fileInfo,
                fileName:action.fileName,
            });
        case GET_FORECAST_RESULT:
            return Object.assign({},state,{
                forecastRes:action.forecastRes,
                btnSpin:false,
            });
        case CHANGE_FORECAST_STATE:
            return Object.assign({},state,{
                btnSpin:action.btnSpin,
            });
        case UPDATE_RESULT:
            return Object.assign({},state,{
                forecastRes:action.forecastRes,
            });
        default:
            return state;
    }
}