/**
 * Created by LXY on 2017/3/14.
 */
export const GET_USER='GET_USER';
export const CHANGE_MODAL_VISIBLE='CHANGE_MODAL_VISIBLE';
export const CHANGE_BTN_SPIN='CHANGE_BTN_SPIN';
export function getUser(userId,token) {
    return {
        type: GET_USER,
        key: userId,
        token:token
    }
}

export function change_modal_visible(visible) {
    return{
        type:CHANGE_MODAL_VISIBLE,
        modalVisible:visible,
    }
}

export function change_btn_spin(spining) {
    return{
        type:CHANGE_BTN_SPIN,
        regBtnSpin:spining,
    }
}