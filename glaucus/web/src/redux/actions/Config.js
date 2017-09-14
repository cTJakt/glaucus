import Get from '../../utils/Get'
/**
 * Created by LXY on 2017/3/17.
 */
// export const GET_ALL = 'GET_ALL';
// export const GET_ALL_CONFIG='GET_ALL_CONFIG';
export const CHANGE_CONFIG = 'CHANGE_CONFIG';
export const UPDATE_ALL_CONFIG='UPDATE_ALL_CONFIG';
const UPDATE_CONFIG='UPDATE_CONFIG';
export const CHANGE_FILE='CHANGE_FILE';
export const CHANGE_CONFIGID = 'CHANGE_CONFIGID';
export const CHANGE_AFTER_ADD='CHANGE_AFTER_ADD';
export const CHANGE_ADD_ID ='CHANGE_ADD_ID';
export const INIT_INFO='INIT_INFO';
export const CHANGE_CONFIG_PAGE='CHANGE_CONFIG_PAGE';
export const CHANGE_CONFIG_PAGE_SPIN='CHANGE_CONFIG_PAGE_SPIN';

export const INIT_CONFIG_INFO='INIT_CONFIG_INFO';       //初始化界面的时候获取所有配置信息并默认第一个配置的信息
export const UPDATE_LIST_INFO='UPDATE_LIST_INFO';   //重新获取文件的所有配置
export const UPDATE_CONFIG_INFO='UPDATE_CONFIG_INFO';   //获取某个配置的配置信息和模型信息

let trainDic = {
    "1": "已训练",
    "0": "训练中",
    "-1": "未训练"
};

export function init_config_page(userId) {  //配置界面初始化时获取所有配置和某个配置的具体信息
    return dispatch=>{
        Get("/api/config/get/all_new?userId=" + userId)
            .then(res=>dispatch(init_config(res['data'])));
    }
}

function init_config(configs) {        //将第一个配置作为默认显示的配置
    return dispatch=>{
        Get("/api/config/get/one/config?configId=" + ((configs.length===0)?"0":configs[0].configId))
            .then(res=>dispatch(init_config_info(configs,(configs.length===0)?null:res['data'])));
    }
}

export function init_config_info(configs,configInfo) {      //初始化页面显示信息
    return{
        type:INIT_CONFIG_INFO,
        configArrays:configs,
        configInfo:configInfo,
        fileId:configs.length===0?"":configs[0].fileId,
        configId:configs.length===0?"":configs[0].configId,
        fileName:configs.length===0?"":configs[0].fileName,
        configName:configs.length===0?"":configs[0].confName,
    }
}

export function update_config_list_add(userId,fileId,configId) {            //重新获取配置信息并更新配置列表,添加的时候使用
    return dispatch=>{
        Get("/api/config/get/all_new?userId=" + userId)
            .then(res=>dispatch(get_new_config_info(res['data'],fileId,configId)));
    }
}

export function get_new_config_info(configs,fileId,configId){
    return dispatch=>{
        Get("/api/config/get/one/config?configId=" + configId)
            .then(res=>dispatch(update_list_info(configs,fileId,res['data'])));
    }
}



export function update_list_info(configs,fileId,configInfo) {    //重新获取配置信息并更新配置列表,删除配置的时候使用的
    return{
        type:UPDATE_LIST_INFO,
        configArrays:configs,
        configInfo:configInfo,
        fileId:fileId,
        configId:configInfo.configId,
        fileName:configs[0].fileName,
        configName:configs[0].confName,
    }
}


export function get_configInfo(configId,fileName,configName) {      //获取选中的configId
    return dispatch=>{
        Get("/api/config/get/one/config?configId=" + configId)
            .then(res=>dispatch(update_configInfo(res['data'],fileName,configName)));
    }
}

export function update_configInfo(configInfo,fileName,configName) {   //获取选择的配置的具体信息
    return{
        type:UPDATE_CONFIG_INFO,
        configId:configInfo.configId,
        configInfo:configInfo,
        fileName:fileName,
        configName:configName,
    }
}



/*配置界面初始化时获取所有配置信息*/
export function get_all(userId) {
    return dispatch=>{
        Get("/api/config/get/all?userId=" + userId)
            .then(res=>dispatch(get_models(userId,res['data'])));
    }
}


/*配置界面获取配置的所有信息*/
export function get_config(userId) {
    return dispatch=>{
        Get("/api/model/get/all?userId=" + userId)
            .then(dispatch(update_config(userId)));
    }
}

/*获取配置的信息*/
function get_models(userId,configInfo){
    return dispatch=>{
        Get("/api/model/get/all?userId=" + userId)
            .then(res=>dispatch(update_all(configInfo,res['data'])));
    }
}

function update_all(configInfo,modelInfo) {
    let modelDetails = modelInfo.filter((item) => (item.configId === configInfo[0].configId))
    let modelData = Object.keys(modelDetails).map(modelId => {
        return {
            "trainedStatus": trainDic[modelDetails[modelId].trainedStatus.toString()],
            "modelName": modelDetails[modelId].modelName.toString(),
            "modelDetailName": modelDetails[modelId].modelDetailName,
            "modelTypeId": modelDetails[modelId].modelTypeId,
            "modelTypeName":modelDetails[modelId].modelTypeName,
        }
    });
    return{
        type:UPDATE_ALL_CONFIG,
        configs:configInfo,
        fileId:configInfo[0].fileId,
        fileName:configInfo[0].fileName,
        configId:configInfo[0].configId,
        configName:configInfo[0].confName,
        featureList:configInfo[0].featureList,
        modelDetail:modelInfo,
        modelData:modelData,
        openKeys:[configInfo[0].fileId],
        modelTypeName:configInfo[0].modelTypeName,
    }
}


function update_config(models,configId){
    return {
        type:UPDATE_CONFIG,
    }
}

export function change_config(configId,configInfo,modelDetail) {
    let modelDetails = modelDetail.filter((item) => (item.configId === configId));
    let modelData = Object.keys(modelDetails).map(modelId => {
        return {
            "trainedStatus": trainDic[modelDetails[modelId].trainedStatus.toString()],
            "modelName": modelDetails[modelId].modelName.toString(),
            "modelDetailName": modelDetails[modelId].modelDetailName,
            "modelTypeId": modelDetails[modelId].modelTypeId,
            "modelTypeName":modelDetails[modelId].modelTypeName,
        }
    });
    let configDetail  = configInfo.filter((item) => (item.configId === configId))[0];
    return{
        type:CHANGE_CONFIG,
        fileId : configDetail.fileId,
        fileName:configDetail.fileName,
        configId:configId,
        configName:configDetail.confName,
        featureList:configDetail.featureList,
        modelData:modelData,

    }
}

/*记录list的openkeys*/
export function change_file(openKeys){
    return{
        type: CHANGE_FILE,
        openKeys:openKeys
    }
}

/*更改configId*/
export function change_configId(configId){
    return{
        type: CHANGE_CONFIGID,
        configId:configId
    }
}

export function change_after_addition(userId,openKeys,configId) { //新增配置之后
    return dispatch=>{
        Get("/api/config/get/all?userId=" + userId)
            .then(res=>dispatch(get_new_model(userId,openKeys,configId,res['data'])));
    }
}

/*获取配置的信息*/
function get_new_model(userId,openKeys,configId,configInfo){
    return dispatch=>{
        Get("/api/model/get/all?userId=" + userId)
            .then(res=>dispatch(update_after_add(openKeys,configId,configInfo,res['data'])));
    }
}

export function update_after_add(openKeys,configId,configInfo,modelInfo) {
    let modelDetails = modelInfo.filter((item) => (item.configId === configId))
    let modelData = Object.keys(modelDetails).map(modelId => {
        return {
            "trainedStatus": trainDic[modelDetails[modelId].trainedStatus.toString()],
            "modelName": modelDetails[modelId].modelName.toString(),
            "modelDetailName": modelDetails[modelId].modelDetailName,
            "modelTypeId": modelDetails[modelId].modelTypeId,
            "modelTypeName":modelDetails[modelId].modelTypeName,
        }
    })
    let nowConfig = configInfo.filter((item) => (item.configId === configId))
    return{
        type:CHANGE_AFTER_ADD,
        configs:configInfo,
        fileId:nowConfig[0].fileId,
        fileName:nowConfig[0].fileName,
        configId:configId,
        configName:nowConfig[0].confName,
        featureList:nowConfig[0].featureList,
        modelDetail:modelInfo,
        modelData:modelData,
        openKeys:openKeys,
        modelTypeName:nowConfig[0].modelTypeName
    }
}

export function change_add_id(configId) {
    return{
        type:CHANGE_ADD_ID,
        addConfigId:configId
    }
}

export function init_info() {
    return{
        type:INIT_INFO,
    }
}

export function change_config_menu(page) {
    return{
        type:CHANGE_CONFIG_PAGE,
        currentConfigPage:page
    }
}


export function change_config_page_spin(spin) {
    return{
        type:CHANGE_CONFIG_PAGE_SPIN,
        configPageSpin:spin
    }
}