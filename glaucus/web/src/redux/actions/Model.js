import Get from '../../utils/Get'
/**
 * Created by LXY on 2017/3/18.
 */
export const CHANGE_MODEL= 'CHANGE_MODEL';
export const UPDATE_MODEL='UPDATE_MODEL';
export const CHANGE_CONFIG ='CHANGE_CONFIG';
export const CHANGE_MODEL_PAGE='CHANGE_MODEL_PAGE';
export const CHANGE_MODAL_STATE='CHANGE_MODAL_STATE';
export const CHANGE_UPLOAD='CHANGE_UPLOAD';
export const GET_FILE_INFO='GET_FILE_INFO';
export const GET_FORECAST_RESULT='GET_FORECAST_RESULT';
export const CHANGE_FORECAST_STATE='CHANGE_FORECAST_STATE';
export const UPDATE_RESULT='UPDATE_RESULT';

/*配置界面获取配置的所有信息*/
export function get_model(userId) {
    return dispatch=>{
        Get("/api/model/get/all?userId=" + userId)
            .then(res=>dispatch(update_model(res['data'])));
    }
}
function update_model(res) {
    return{
        type:UPDATE_MODEL,
        models:res,
        modelId:res[0].modelId,
        configId:res[0].configId,
        openKeys:[res[0].configId]
    }
}

export function change_model(modelId){
    return{
        type:CHANGE_MODEL,
        modelId:modelId
    }
}

/*记录list的openkeys*/
export function change_config(openKeys){
    return{
        type: CHANGE_CONFIG,
        openKeys:openKeys
    }
}

export function change_model_page(page) {
    return{
        type:CHANGE_MODEL_PAGE,
        currentModelPage:page,
    }
}

export function change_modal_state(visible) {
    return{
        type:CHANGE_MODAL_STATE,
        modalVisible:visible
    }
}

export function change_upload(loading) {    //更改上传按钮的状态
    return{
        type:CHANGE_UPLOAD,
        uploadLoading:loading
    }
}

export function get_file_info(fileId,fileName,fileInfo) {
    return{
        type:GET_FILE_INFO,
        fileId:fileId,
        fileInfo:fileInfo,
        fileName:fileName,
    }
}

export function begin_forecast(fileId,modelId) {
    return dispatch=>{
        Get("/api/model/use?modelId=" + modelId+"&fileId="+fileId)
            .then(res=>dispatch(get_forecast_result(res)));
    }
}

export function get_forecast_result(res) {          //获取使用模型预测后的结果
    let data=res['data'];
    return{
        type:GET_FORECAST_RESULT,
        forecastRes:data,
    }
}

export function change_forecast_state(spin) {
    return{
        type:CHANGE_FORECAST_STATE,
        btnSpin:spin
    }
}

export function update_result(res) {
    return{
        type:UPDATE_RESULT,
        forecastRes:res,
    }
}