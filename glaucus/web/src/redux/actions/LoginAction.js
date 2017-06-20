/**
 * Created by LXY on 2017/3/14.
 */
export const GET_USER='GET_USER'
export function getUser(userId) {
    return {
        type: GET_USER,
        key: userId
    }
}