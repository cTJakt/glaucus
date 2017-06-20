import {GET_USER} from '../actions/LoginAction'
/**
 * Created by LXY on 2017/3/14.
 */
const initialState = {
    userId:""
}


export default (state = initialState, action) => {
    let newState;
    switch  (action.type) {
        case GET_USER:
            return Object.assign({},state,{
                userId:action.userId,
            })
        default:
            return state;
    }
}