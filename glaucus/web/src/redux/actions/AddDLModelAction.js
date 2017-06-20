import Get from '../../utils/Get'
import DLGet from '../../utils/DLGet'
import * as _ from "underscore";
/**
 * Created by LXY on 2017/6/18.
 */
export const GET_FILES='GET_FILES';         //获取所有dl文件
export const CHANGE_FILE='CHANGE_FILE';     //改变选中的文件
export const UPDATE_DL_ARGS='UPDATE_DL_ARGS';       //更新dl的参数
export const GET_MODELS='GET_MODELS';       //获取
export const CHANGE_MODEL='CHANGE_MODEL';
export const UPDATE_EDIT_ARGS='UPDATE_EDIT_ARGS';


export function get_dl_models() {     //获取深度学习model
    return dispatch=>{
        Get("/api/model/get/models?modelTypeName=" + "dl")
            .then(res=>dispatch(get_models(res['data'])));
    }
}

function get_models(models) {
    return{
        type:GET_MODELS,
        dlModels:models.length===0?[]:models
    }
}


export function get_dl_files(userId) {     //获取深度学习文件
    return dispatch=>{
        Get("/api/picture/get/all/proj?userId=" + userId)
            .then(res=>dispatch(get_files(res['data'])));
    }
}

function get_files(files) {
    return{
        type:GET_FILES,
        files:files.length===0?[]:files
    }
}

export function change_file(fileId) {    //选中的文件改变
    return{
        type:CHANGE_FILE,
        fileId:fileId
    }
}

export function change_model(modelId,models) {   //选中的模型改变
    const chooseModel = _.filter(models, model => {
        return (model.id === modelId)
    })[0];
    const args = _.map(_.keys(chooseModel.arguments), key => {
        const argInfo = chooseModel.arguments[key];
        return {
            'argName' : key,
            'argValue': argInfo.defaultValue,
            "argRange": argInfo.valueDes,
            "argDes"  : argInfo.description,
            "argType" : argInfo.type,
            "editable":false,//更改每行不可编辑
        }

    });
    return{
        type:CHANGE_MODEL,
        dlModelId:modelId,
        arguments:args
    }
}

export function update_args(args) {     //保存参数
    return{
        type:UPDATE_DL_ARGS,
        arguments:args
    }
}

export function update__edit_args(args) {   //更新参数
    return{
        type:UPDATE_EDIT_ARGS,
        arguments: args
    }
}