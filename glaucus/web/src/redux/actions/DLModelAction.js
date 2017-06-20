import Get from '../../utils/Get'
/**
 * Created by LXY on 2017/6/18.
 */
export const INIT_DL_MODEL='INIT_DL_MODEL';     //初始化界面
export const GET_ONE_MODEL='GET_ONE_MODEL';     //获取某个具体的model
// export const CHANGE_SELECT_MODEL='CHANGE_SELECT_MODEL';     //改变选中的model
export const CHANGE_VISIBLE='CHANGE_VISIBLE';     //对话框的可见性
export const GET_DL_FORECAST_RESULT='GET_DL_FORECAST_RESULT';   //获取预测结果
export const CHANGE_DL_FORECAST_STATE='CHANGE_DL_FORECAST_STATE';   //改变预测按钮的状态
export const UPDATE_DL_RESULT='UPDATE_DL_RESULT';       //更新预测结果
export const CHANGE_SELECT_FILE='CHANGE_SELECT_FILE';   //改变选中的文件
export const CHANGE_DL_MODEL_PAGE='CHANGE_DL_MODEL_PAGE';   //menu页数改变

export function get_dl_all(userId){     //初始化界面
    return dispatch=>{
        Get("/api/model/get/all/dl?userId=" + userId)
            .then(res=>dispatch(update_all_dl(res['data'])));
    }
}

function update_all_dl(models) {
    let modelId = models.length===0?"":models[0].modelId;
    return dispatch=>{
        Get("/api/model/get/detail/dl?modelId=" + modelId)
            .then(res=>dispatch(init_dl_model(models,res['data'])));
    }
}

function init_dl_model(models,modelInfo){       //初始化界面时 更新值
    return{
        type:INIT_DL_MODEL,
        models:models,
        modelInfo:modelInfo,
        modelId:models.length===0?"":models[0].modelId,
        selectedFile:models.length===0?"":models[0].fileId,
        fileName:models.length===0?"":models[0].fileName,
        openKeys:models.length===0?[]:[models[0].fileId]
    }
}

export function get_the_model(modelId) {       //获取某个特定的模型
    return dispatch=>{
        Get("/api/model/get/detail/dl?modelId=" + modelId)
            .then(res=>dispatch(get_one_model(res['data'])));
    }
}

function get_one_model(modelInfo) {
    return{
        type:GET_ONE_MODEL,
        modelInfo:modelInfo,
        fileName:modelInfo.fileName,
        modelId:modelInfo.id,
    }
}

export function change_visible(visible) {  //对话框的可见性
    return{
        type:CHANGE_VISIBLE,
        modalVisible:visible
    }
}

export function change_dl_model_page(page) {       //更改menu的页数
    return{
        type:CHANGE_DL_MODEL_PAGE,
        currentModelPage:page,
    }
}

export function change_select_file(openKeys) {
    return{
        type:CHANGE_SELECT_FILE,
        openKeys:openKeys
    }
}

