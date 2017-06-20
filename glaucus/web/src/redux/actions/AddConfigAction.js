import Get from '../../utils/Get'
import DLGet from '../../utils/DLGet'
import * as _ from "underscore";
/**
 * Created by LXY on 2017/3/19.
 */

export const GET_FILE = 'GET_FILE';
export const GET_FEATURE = 'GET_FEATURE';
export const FILE_SELECT='FILE_SELECT';
export const UPDATE_CONFIG='UPDATE_CONFIG';
export const UPDATE_MODEL='UPDATE_MODEL';
export const ADD_CONFIG='ADD_CONFIG';
export const FEATURE_CHANGE='FEATURE_CHANGE';
export const CHANGE_MODEL_TYPE='CHANGE_MODEL_TYPE';
export const CHANGE_STEP = 'CHANGE_STEP';
export const GET_MODEL = 'GET_MODEL';
export const UPDATE_MODEL_INFO='UPDATE_MODEL_INFO';
export const ADD_MODEL_ARGS = 'ADD_MODEL_ARGS';
export const UPDATE_WHEN_CHANGE = 'UPDATE_WHEN_CHANGE';
export const UPDATE_EDIT_TRUE='UPDATE_EDIT_TRUE';
export const UPDATE_ARG_VALUE='UPDATE_ARG_VALUE';
export const DO_INIT='DO_INIT';
export const AUTO_GET_FEATURES='AUTO_GET_FEATURES';
export const CHANGE_SELECT_WAY='CHANGE_SELECT_WAY';
export const CHANGE_BTN_STATE='CHANGE_BTN_STATE';
export const CHANGE_FEATURE_SPIN='CHANGE_FEATURE_SPIN';
export const SELECT_METHOD='SELECT_METHOD';
export const SELECT_FIELDS='SELECT_FIELDS';

/*获取所有文件*/
export function get_files(userId){
    return dispatch=>{
        Get("/api/file/get/all?userId=" + userId)
            .then(res=>dispatch(get_file(res)))
    }
}

/*获取所选文件的所有特征*/
export function get_features(fileId) {
    return dispatch=>{
        Get("/api/file/get/detail?fileId=" + fileId)
            .then(res=>dispatch(get_feature(fileId,res)))
    }
}


function get_file(res){
    return{
        type:GET_FILE,
        files:res['data']
    }
}

function get_feature(fileId,res){
    const headerInfos = res['data'].headerInfos;
    console.log(headerInfos);
    const listData = _.map(headerInfos, info => {
        return {
            "key": info.id,
            "title": info.fieldName,
            "description": info.fieldDes,
            "fieldName": info.fieldName,
            "fieldType":info.fieldType,
        }
    });
    return{
        type:GET_FEATURE,
        featureList:listData,
        fileId:fileId
    }
}

export function file_select(fileId){
    return{
        type:FILE_SELECT,
        fileId:fileId
    }
}

/*更新所选择的配置信息*/
export function update_config(values,features){
    return{
        type:UPDATE_CONFIG,
        featureSelectDataReady: true,
        fileId: values.fileId,
        modelTypeName: values.modelTypeName,
        confName: values.confName,
        trainFeatureList: values.featureList,
    }
}

/*更新所选择的模型信息*/
export function update_model(value) {

    //
    return{
        type:UPDATE_MODEL,
        modelSelectDataReady: true,
        modelName: value.modelName,
        modelTypeId: value.modelDetailId,
        modelDetailName: value.modelDetailName,
        modelArguments: value.modelArguments
    }
}

/*向数据库中添加配置及其相应的模型信息*/
export function add_config(configInfo,modelInfo) {
    
}

export function feature_change(targetKeys){
    return{
        type:FEATURE_CHANGE,
        targetKeys:targetKeys
    }
}

export function change_model_type(modelType){
    return{
        type:CHANGE_MODEL_TYPE,
        modelType:modelType
    }
}

/*更改步数*/
export function change_step(stepCurrent){
    return{
        type:CHANGE_STEP,
        stepCurrent:stepCurrent
    }
}

/*获取预存模型的参数等信息*/
export function get_model(res){

    //在model的args参数中添加一个editable参数并初始化为false
    return{
        type:GET_MODEL,
        modelTypeName: res['data'][0].modelTypeName,
        modelDes: res['data'][0].modelDes,
        models: res['data'],
    }
}

/*获取模型参数信息的异步操作*/
export function get_models(modelTypeName){
    return dispatch=>{
        Get("/api/model/get/models?modelTypeName=" + modelTypeName)
            .then(res=>dispatch(get_model(res)))
    }
}

/*更新数据，并将该单元格的editable属性设置为false*/
export function update_model_info(nowArguments) {
    return {
        type: UPDATE_MODEL_INFO,
        modelArguments: nowArguments
    }
}

export function add_model_args(values) {
    return{
        type:ADD_MODEL_ARGS,
        modelArguments: values
    }
}

/*当切换所选择的模型时，将所有的参数editable设置为false*/
export function update_when_change(models,modelId){
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

    })
    return{
        type:UPDATE_WHEN_CHANGE,
        modelDetailName: chooseModel.modelDetailName,
        modelDetailDes: chooseModel.modelDes,
        // arguments: args,
        modelArguments: args,
        modelId:modelId
    }
}

/*点击edit时，将editable设置为true*/
export function update_edit_true(nowArguments) {

    return {
        type: UPDATE_EDIT_TRUE,
        modelArguments: nowArguments
    }
}

/*更新参数*/
export function update_arg_value(nowArguments) {
    return {
        type: UPDATE_ARG_VALUE,
        modelArguments: nowArguments
    }
}

export function do_init() {
    return{
        type:DO_INIT
    }
}

export function auto_feature(method,resField,fileId,fieldName) {        //根据目标量自动获取特征
    if(method==="ChiSqSelector"){
        return dispatch=>{
            Get("/api/config/get/features?fileId="+fileId+"&fieldName="+fieldName)
                .then(res=>dispatch(auto_get_feature(method,resField,res)))
        }
    }else{
        return dispatch=>{
            DLGet("/api/config/get/features?fileId="+fileId+"&fieldName="+fieldName+"&methodId="+method)
                .then(res=>dispatch(auto_get_feature(method,resField,res)))
        }
    }
}

function auto_get_feature(method,resField,res) {
    if(method==="ChiSqSelector"){
        let headerInfo = res.data;       //返回的信息
        let features=[];   //训练字段
        for(let i=0;i<headerInfo.length;i++){
            features.push(headerInfo[i].id);
        }
        features.push(resField);
        return{
            type:AUTO_GET_FEATURES,
            targetKeys:features,
            btnLoading:false,
            featureSpinLoading:false,
            featureResult:[],
        }
    }else{
        let headerInfo = res.data;       //返回的信息
        let features=[];   //训练字段
        for(let i=0;i<headerInfo.length;i++){
            features.push(headerInfo[i].id);
        }
        features.push(resField);
        return{
            type:AUTO_GET_FEATURES,
            targetKeys:features,
            btnLoading:false,
            featureSpinLoading:false,
            featureResult:res.data,
        }
    }

}

export function change_select_way(way) {
    return{
        type:CHANGE_SELECT_WAY,
        featureSelectWay:way
    }
}

export function change_btn_state(loading){
    return{
        type:CHANGE_BTN_STATE,
        btnLoading:loading
    }
}

export function change_feature_spin(loading) {
    return{
        type:CHANGE_FEATURE_SPIN,
        featureSpinLoading:loading
    }
}

export function select_method(method) {
    return{
        type:SELECT_METHOD,
        methodId:method,
    }
}

export function select_field(fieldId) {     //全自动训练时选择目标字段
    return{
        type:SELECT_FIELDS,
        objectField:fieldId
    }
}


