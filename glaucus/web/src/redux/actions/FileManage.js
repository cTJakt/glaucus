import Get from '../../utils/Get'

/**
 * Created by LXY on 2017/3/10.
 */

export const GET_FILES = 'GET_FILES';
export const UPDATE_ALL = 'UPDATE_ALL';
export const SAVE_FILE = 'SAVE_FILE';
export const ADD_CONFIG='ADD_CONFIG';
export const DELETE_FILE='DELETE_FILE';
export const UPDATE_FILE = 'UPDATE_FILE';
export const UPDATE_FILEINFO = 'UPDATE_FILEINFO';
export const ANALYSE_FILE = 'ANALYSE_FILE';
export const UPDATE_HEADER_INFO='UPDATE_HEADER_INFO';
export const GET_PAGINATION='GET_PAGINATION';
export const UPDATE_ANA_BUTTON='UPDATE_ANA_BUTTON';
export const GET_HEADER_ID='GET_HEADER_ID';
export const CHANGE_VISIBLE='CHANGE_VISIBLE';
export const CHANGE_FIELD_LIST='CHANGE_FIELD_LIST';
export const SELECT_FUNCTION='SELECT_FUNCTION';
export const INIT_FILE ='INIT_FILE';
export const GET_ANA_RESULT='GET_ANA_RESULT';
export const CHANGE_UPLOAD_BTN='CHANGE_UPLOAD_BTN';
export const GET_ALL_FUNCTION='GET_ALL_FUNCTION';
export const MENU_PAGE_CHANGE="MENU_PAGE_CHANGE";
export const UPDATE_FILE_ID="UPDATE_FILE_ID";


/*初始化界面时获取用户文件信息*/
function getFiles(userId) {
    return dispatch=>{
        Get("/api/file/get/all?userId=" + userId)
            .then(res=>dispatch(update(res['data'])));
    }
}

/*获取某个文件的具体信息*/
function getFileInfos(fileId) {
    return dispatch=>{
        Get("/api/file/get/detail?fileId=" + fileId)
            .then(data=>dispatch(updateFileInfo(data['data'],fileId)))
    }
}

/*更新文件信息state,即fileData*/
function updateFile(res){
    return{
        type:UPDATE_FILE,
        fileData:res
    }
}


function update(res) {
    return dispatch=>{
        Get("/api/file/get/detail?fileId=" + res[0].fileId)
            .then(data=>dispatch(updateAll(res,data['data'])))
    }
}

/*更新所有文件和具体文件信息*/
export function updateAll(fileData,data) {
    return{
        type:UPDATE_ALL,
        fileData:fileData,
        fileInfoData:data,
        fileId:fileData[0].fileId
    }
}

/*更新某个文件信息的state即fileInfoData*/
function updateFileInfo(data,fileId) {
    return{
        type:UPDATE_FILEINFO,
        fileInfoData:data,
        fileId:fileId
    }
}

/*H获取文件action*/
export function getFile(userId){
    return (dispatch,getState)=>{
        return dispatch(getFiles(userId));
    }
}

/*获取文件信息action*/
export function getFileInfo(fileId) {
    return (dispatch,getState) =>{
        return dispatch(getFileInfos(fileId));
    }
}

export function analyse_file(fileId){
    return dispatch=>{

    }
}

/*更改文件头的信息,别名和描述*/
export function update_header_info(newHeaderInfo) {
    return{
        type:UPDATE_HEADER_INFO,
        headerInfo :newHeaderInfo
    }
}

export function get_pagination(pagination){ //获取表格的分页信息
    return{
        type:GET_PAGINATION,
        maxCell:pagination.pageSize,
        currentPage:pagination.current,
    }
}

export function update_ana_button(analysed,analysedTxt,fileId) {
    return{
        type:UPDATE_ANA_BUTTON,
        analysedTxt:analysedTxt,//记录分析按钮展示的数据
        analysed:analysed,//记录分析是否完成
        fileId:fileId
    }
}


export function get_header_id(newHeaderInfo,newHeaderList) {   //更改headerInfo,更新被编辑过的headerLisr
    return{
        type:GET_HEADER_ID,
        headerInfo :newHeaderInfo,
        headersNeedUpdate:newHeaderList
    }
}

export function change_visible(visible) {   //更改对话框的visible属性
    return{
        type:CHANGE_VISIBLE,
        visible:visible
    }
}

export function change_field_list(targetKeys) { //更新选择需要分析的字段,分析结果也为空
    return{
        type:CHANGE_FIELD_LIST,
        targetKeys:targetKeys,
    }
}

export function select_function(functionId,functionDescription){    //更新所选择的分析方法,选择的目标字段重置
    return{
        type:SELECT_FUNCTION,
        selectFunction:functionId,
        functionDescription:functionDescription,
        targetKeys:[],
    }
}

export function init_file(){ //初始化界面
    return{
        type:INIT_FILE
    }
}

export function get_ana_result(result,loading) {    //获取字段分析的结果
    return{
        type:GET_ANA_RESULT,
        anaResult:result,
        confirmLoading:loading,
    }
}

export function change_upload_btn(res) {
    return{
        type:CHANGE_UPLOAD_BTN,
        fileUploading:res,
    }
}

export function get_ana_functions(){        //获取字段分析的函数
    return dispatch=>{
        Get("/api/file/get/allfileandfunc")
            .then(res=>dispatch(get_all_functions(res)));
    }
}

export function get_all_functions(res) {
    return{
        type:GET_ALL_FUNCTION,
        anaFunctions:res.data.funcInfos
    }
}

export function menu_page_change(page){
    return{
        type:MENU_PAGE_CHANGE,
        currentMenuPage:page
    }
}

export function update_file_id(fileId){
    return{
        type:UPDATE_FILE_ID,
        fileId:fileId
    }
}