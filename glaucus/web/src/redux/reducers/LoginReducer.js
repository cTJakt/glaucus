import {GET_USER,CHANGE_MODAL_VISIBLE,CHANGE_BTN_SPIN} from '../actions/LoginAction'
/**
 * Created by LXY on 2017/3/14.
 */
const initialState = {
    userId:"",
    modalVisible:false,     //注册对话框
    regBtnSpin:false,         //对话框注册按钮
    token:"",
};


export default (state = initialState, action) => {
    switch  (action.type) {
        case GET_USER:
            return Object.assign({},state,{
                userId:action.key,
                token:action.token,
            });
        case CHANGE_MODAL_VISIBLE:
            return Object.assign({},state,{
                modalVisible:action.modalVisible,
            });
        case CHANGE_BTN_SPIN:
            return Object.assign({},state,{
                regBtnSpin:action.regBtnSpin,
            });
        default:
            return state;
    }
}