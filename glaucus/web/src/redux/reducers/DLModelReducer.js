import {INIT_DL_MODEL,GET_ONE_MODEL,CHANGE_VISIBLE,CHANGE_SELECT_FILE,CHANGE_DL_MODEL_PAGE} from '../actions/DLModelAction'
/**
 * Created by LXY on 2017/6/18.
 */
const initialState={
    models:[],      //模型及其文件信息
    modelInfo:"",   //某个模型具体信息
    modelId:"",
    selectedFile:"",
    fileName:"",
    openKeys:[],
    currentModelPage:1,
    modalVisible:false,
    uploadLoading:false,
    fileId:"",
    fileInfo:[],
    btnSpin:false,
    forecastRes:[]
};
export default (state = initialState, action) => {
    switch (action.type) {
        case INIT_DL_MODEL:
            return Object.assign({},state,{
                models:action.models,
                modelInfo:action.modelInfo,
                modelId:action.modelId,
                selectedFile:action.selectedFile,
                fileName:action.fileName,
                openKeys:action.openKeys
            });
        case GET_ONE_MODEL:
            return Object.assign({},state,{
                modelInfo:action.modelInfo,
                modelId:action.modelId,
                fileName:action.fileName,
            });
        case CHANGE_VISIBLE:
            return Object.assign({},state,{
                modalVisible:action.modalVisible
            });
        case CHANGE_SELECT_FILE:
            return Object.assign({},state,{
                openKeys:action.openKeys
            });
        case CHANGE_DL_MODEL_PAGE:
            return Object.assign({},state,{
                currentModelPage:action.currentModelPage
            });
        default:
            return state;
    }
}