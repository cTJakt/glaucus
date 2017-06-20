import Get from '../../utils/Get'
/**
 * Created by LXY on 2017/6/5.
 */
export const GET_IMAGE_FOLDERS='GET_IMAGE_FOLDERS';
export const GET_IMAGE_CLASSES='GET_IMAGE_CLASSES';
export const GET_IMAGES='GET_IMAGES';
export const CHANGE_FOLDER='CHANGE_FOLDER';
export const CHANGE_CLASS='CHANGE_CLASS';
export const CHANGE_PAGE_INDEX='CHANGE_PAGE_INDEX';
export const CHANGE_LIST_PAGE='CHANGE_LIST_PAGE';
export const CHANGE_MODAL_STATE='CHANGE_MODAL_STATE';
export const UPDATE_IMAGE_CLASS='UPDATE_IMAGE_CLASS';
export const INIT_IMAGE_PAGE='INIT_IMAGE_PAGE';
export const CHANGE_CLASS_SPIN='CHANGE_CLASS_SPIN';
export const CHANGE_SELECT_IMAGE='CHANGE_SELECT_IMAGE';

export function init_get_all(userId) {     //初始化界面的时候获取所有的folder信息和默认的class
    return dispatch=>{
        Get("/api/picture/get/all/proj?userId=" + userId)
            .then(res=>dispatch(get_all_info(res)));
    }
}

function get_all_info(res) {
    let folderInfo=res['data'];
    let folderId=folderInfo.length===0?0:folderInfo[0].fileId;
    return dispatch=>{
        Get("/api/picture/get/one/proj?picFileId=" + folderId)
            .then(res=>dispatch(init_image_page(folderInfo,res['data'])));
    }
}

function init_image_page(folderInfo,classInfo) {
    let defaultSelectFolder="";
    if(folderInfo.length!==0)
        defaultSelectFolder=folderInfo[0].fileId;
    return{
        type:INIT_IMAGE_PAGE,
        imageFolders:folderInfo,        //所有的图片文件夹
        imageClass:classInfo,
        selectFolder:defaultSelectFolder
    }
}

export function get_folders(userId) {        //获取所有文件夹
    return dispatch=>{
        Get("/api/picture/get/all/proj?userId=" + userId)
            .then(res=>dispatch(get_image_folders(res)));
    }
}

function get_image_folders(res) {
    return{
        type:GET_IMAGE_FOLDERS,
        imageFolders:res['data']
    }
}

export function get_classes(folderId) {     //获取文件夹下所有图片类别
    return dispatch=>{
        Get("/api/picture/get/one/proj?picFileId=" + folderId)
            .then(res=>dispatch(get_image_classes(res)));
    }
}

function get_image_classes(res) {
    return{
        type:GET_IMAGE_CLASSES,
        imageClass:res['data']
    }
}

export function get_image(classId) {
    return dispatch=>{
        Get("/api/picture/get/pics?picTag=" + classId)
            .then(res=>dispatch(get_images(res)));
    }
}

function get_images(res) {
    return{
        type:GET_IMAGES,
        images:res['data']
    }
}

export function change_folder(folderId) {   //更换选择的文件夹
    return{
        type:CHANGE_FOLDER,
        selectFolder:folderId
    }
}

export function change_class(classId) {
    return{
        type:CHANGE_CLASS,
        selectClass:classId
    }
}

export function change_page_index(page) {       //页面深度变化
    return{
        type:CHANGE_PAGE_INDEX,
        pageIndex:page
    }
}

export function change_list_page(page) {    //list分页变化时
    return{
        type:CHANGE_LIST_PAGE,
        menuPage:page
    }
}

export function change_modal_state(sta) {
    return{
        type:CHANGE_MODAL_STATE,
        modalState:sta
    }
}

export function update_image_class(classes) {
    return{
        type:UPDATE_IMAGE_CLASS,
        changedClass:classes
    }
}

export function change_class_spin(spinState) {
    return{
        type:CHANGE_CLASS_SPIN,
        classSpinState:spinState
    }
}


export function change_select_image(image) {
    return{
        type:CHANGE_SELECT_IMAGE,
        selectImage:image
    }
}

