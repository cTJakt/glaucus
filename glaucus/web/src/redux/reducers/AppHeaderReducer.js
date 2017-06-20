import {CHANGE_PAGE} from '../actions/AppHeaderActions'
/**
 * Created by LXY on 2017/3/14.
 */
const initialState={
    key:"fileManage",
}

export default (state = initialState, action) => {
    let newState;
    switch  (action.type) {
        case CHANGE_PAGE:
            return Object.assign({},state,{
                key:action.key
            })
        default:
            return state;
    }
}