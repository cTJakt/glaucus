import { fromJS } from 'immutable';
import {UPDATE_FILE,UPDATE_FILEINFO,UPDATE_HEADER_INFO,GET_PAGINATION,UPDATE_ANA_BUTTON,GET_HEADER_ID,UPDATE_FILE_ID,
    CHANGE_VISIBLE,CHANGE_FIELD_LIST,SELECT_FUNCTION,INIT_FILE,GET_ANA_RESULT,CHANGE_UPLOAD_BTN,GET_ALL_FUNCTION,MENU_PAGE_CHANGE} from '../actions/FileManage'
/**
 * Created by LXY on 2017/3/11.
 */
const initialState={
    filesData:{
        isFetching:false,
        didInvalidate: false,
        files:[]
    },
    fileDetailData: {
        fileName: "",
        fileDetail: [],
        createTime: "",
        fileInfo: [],
        isFetching:false,
        didInvalidate: false,
    },
    userId:"582468b2f995e5ce9ed99007",
    fileId: "",
    maxCell:0,
    currentPage:1,
    analysedTxt:"开始分析",//记录分析按钮展示的数据
    analysed:false,//记录分析是否完成
    headersNeedUpdate:[], //记录被编辑过的header id
    modalData: {    //记录字段选择对话框的相关信息
        visible:false,  //对话框是否可见
        targetKeys:[],  //选择的目标字段,
        anaResult:[],
        confirmLoading:false
    },
    anaFunctions:[
        // {
        //     id:"1",
        //     functionName:"百分位",
        //     description:"计算某个字段的百分位"
        // },
        // {
        //     id:"2",
        //     functionName:"协方差",
        //     description:"相关系数算法用于计算一个矩阵中每一列之间的协方差"
        // }
    ], //所有的字段分析函数
    selectFunction:"", //选择的字段函数
    functionDescription:"", //所选函数的描述
    fileUploading:false,
    currentMenuPage:1,
    imageData:{
        id:"image",
        directory:"mnist",
        fileList:[
            {
                fileId:"image_train_x",
                fileName:"x_train",
                fileSize:"28*28*60000"
            },
            {
                fileId:"image_train_y",
                fileName:"y_train",
                fileSize:"1*10*60000"
            }, {
                fileId:"image_test_x",
                fileName:"x_test",
                fileSize:"28*28*10000"
            },
            {
                fileId:"image_test_y",
                fileName:"y_test",
                fileSize:"1*10*10000"
            }
        ]

    }
}

function imeStamp2String (time){
    let datetime = new Date();
    datetime.setTime(time);
    let year = datetime.getFullYear();
    let month = datetime.getMonth() + 1;
    let date = datetime.getDate();
    let hour = datetime.getHours();
    let minute = datetime.getMinutes();
    if(minute<10) minute="0"+minute;
    return year + "-" + month + "-" + date+" "+hour+":"+minute;
}


export default (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case UPDATE_FILE:
            return Object.assign({},state,{
                filesData:{
                    isFetching:true,
                    didInvalidate: true,
                    files:action.fileData
                },
                fileId:action.fileId
            });
        case UPDATE_FILEINFO:
            const header = action.fileInfoData.headerInfos;
            const newFileInFO=Object.keys(header).map(id => {
                return {
                    "aliasName":header[id].aliasName,
                    "fieldDes":header[id].fieldDes,
                    "fieldName":header[id].fieldName,
                    "fieldType":header[id].fieldType,
                    "conOrDis":header[id].conOrDis,
                    "fileInfoId":header[id].fileInfoId,
                    "id":header[id].id,
                    "nullsRatio":header[id].nullsRatio,
                    "valueInfo":header[id].valueInfo,
                    "aliasNameEditable":false,
                    "fieldDesEditable":false
                }
            })
            let didAna=false,text = "开始分析";
            if(action.fileInfoData.fileStrucInfo!==null) {
                text ="分析完成";
                didAna = true;
            }
            return Object.assign({},state,{
                fileDetailData: {
                    fileName: action.fileInfoData.fileName,
                    fileDetail: newFileInFO,
                    createTime: action.fileInfoData.createTime,
                    fileInfo: action.fileInfoData.fileStrucInfo,
                    isFetching:true,
                    didInvalidate: true
                },
                fileId:action.fileId,
                analysedTxt:text,//记录分析按钮展示的数据
                analysed:didAna,//记录分析是否完成
                headersNeedUpdate:[],
                modalData: Object.assign({}, state.modalData, {
                    visible:false,
                    targetKeys:[],
                    anaResult:[],
                    confirmLoading:false
                }),
                // selectFunction:"", //选择的字段函数
                // functionDescription:"", //所选函数的描述
            });
        case 'UPDATE_ALL':
            const header1 = action.fileInfoData.headerInfos;
            const newFileInfo1=action.fileInfoData.length===0?[]:Object.keys(header1).map(id => {
                return {
                    "aliasName":header1[id].aliasName,
                    "fieldDes":header1[id].fieldDes,
                    "fieldName":header1[id].fieldName,
                    "fieldType":header1[id].fieldType,
                    "conOrDis":header1[id].conOrDis,
                    "fileInfoId":header1[id].fileInfoId,
                    "id":header1[id].id,
                    "nullsRatio":header1[id].nullsRatio,
                    "valueInfo":header1[id].valueInfo,
                    "aliasNameEditable":false,
                    "fieldDesEditable":false
                }
            });
            let didAna1=false,text1 = "开始分析";
            if(action.fileInfoData.fileStrucInfo!==null) {
                text1 ="分析完成";
                didAna1 = true;
            }
            return Object.assign({},state,{
                filesData:{
                    isFetching:true,
                    didInvalidate: true,
                    files:action.fileData
                },
                fileDetailData: {
                    fileName: action.fileInfoData.length===0?"":action.fileInfoData.fileName,
                    fileDetail: newFileInfo1,
                    createTime: action.fileInfoData.length===0?"":action.fileInfoData.createTime,
                    fileInfo: action.fileInfoData.length===0?"":action.fileInfoData.fileStrucInfo,
                    isFetching:true,
                    didInvalidate: true
                },
                fileId:action.fileId,
                analysedTxt:text1,//记录分析按钮展示的数据
                analysed:didAna1,//记录分析是否完成
                headersNeedUpdate:[],
                modalData: Object.assign({}, state.modalData, {
                    visible:false,
                    targetKeys:[],
                })
            });
        case 'addConfig':
            return state;
        case 'deleteFile':
            return state;
        case UPDATE_HEADER_INFO:
            return Object.assign({},state,{
                fileDetailData :Object.assign({},state.fileDetailData,{
                    fileDetail: action.headerInfo,
                }),
            })
        case GET_PAGINATION:
            return Object.assign({},state,{
                maxCell:action.maxCell,
                currentPage:action.currentPage,
            })
        case UPDATE_ANA_BUTTON:
            return Object.assign({},state,{
                analysedTxt:action.analysedTxt,//记录分析按钮展示的数据
                analysed:action.analysed,//记录分析是否完成
                fileId:action.fileId
            })
        case GET_HEADER_ID:
            return Object.assign({},state,{
                fileDetailData :Object.assign({},state.fileDetailData,{
                    fileDetail: action.headerInfo,
                }),
                headersNeedUpdate:action.headersNeedUpdate
            })
        case CHANGE_VISIBLE:
            return  Object.assign({},state, {
                modalData: Object.assign({}, state.modalData, {
                    visible:action.visible
                })
            });
        case CHANGE_FIELD_LIST:
            return  Object.assign({},state, {
                modalData: Object.assign({}, state.modalData, {
                    targetKeys:action.targetKeys,
                    anaResult:[]
                })
            });
        case SELECT_FUNCTION:
            return Object.assign({},state,{
                selectFunction:action.selectFunction,
                functionDescription:action.functionDescription,
                modalData: Object.assign({}, state.modalData, {
                    targetKeys:action.targetKeys,
                })
            })
        case GET_ANA_RESULT:
            return  Object.assign({},state, {
                modalData: Object.assign({}, state.modalData, {
                    anaResult:action.anaResult,
                    confirmLoading:action.confirmLoading
                })
            });
        case CHANGE_UPLOAD_BTN:
            return  Object.assign({},state, {
                fileUploading:action.fileUploading
            });
        case GET_ALL_FUNCTION:
            return  Object.assign({},state, {
                anaFunctions:action.anaFunctions
            });
        case MENU_PAGE_CHANGE:
            return  Object.assign({},state, {
                currentMenuPage:action.currentMenuPage
            });
        case UPDATE_FILE_ID:
            return  Object.assign({},state, {
                fileId:action.fileId
            });
        case INIT_FILE:
            return initialState;
        default:
            return state;
    }
}
