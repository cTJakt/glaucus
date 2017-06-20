/**
 * Created by LXY on 2017/3/14.
 */
export const CHANGE_PAGE='CHANGE_PAGE'

export function changePage(currentKey){
    return{
        type:CHANGE_PAGE,
        key:currentKey
    }
}