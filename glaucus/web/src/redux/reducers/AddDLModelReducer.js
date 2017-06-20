import {GET_FILES,CHANGE_FILE,UPDATE_DL_ARGS,GET_MODELS,CHANGE_MODEL,UPDATE_EDIT_ARGS} from '../actions/AddDLModelAction'
/**
 * Created by LXY on 2017/6/18.
 */
const initialState={
    fileId:"",
    dlModelId:"",       //选中的具体的预存模型
    dlModels:[],        //dl预存模型
    files:[],           //所有文件
    nowArguments:[],       //初始默认的arguments
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_FILES:
            return Object.assign({}, state, {
                files: action.files
            });
        case CHANGE_FILE:
            return Object.assign({}, state, {
                fileId: action.fileId
            });
        case UPDATE_DL_ARGS:
            return Object.assign({}, state, {
                nowArguments: action.arguments
            });
        case GET_MODELS:
            return Object.assign({}, state, {
                dlModels: action.dlModels
            });
        case CHANGE_MODEL:
            return Object.assign({}, state, {
                nowArguments: action.arguments,
                dlModelId:action.dlModelId,
            });
        default:
            return state;
    }
}
