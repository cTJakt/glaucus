import * as _ from "underscore";
import Strings from '../resources/values/string'
import 'whatwg-fetch'
import Auth from './Auth'
import {message} from 'antd'
import {hashHistory} from 'react-router'
/** 网络请求街口
 * server class
 * Created by lucas on 2016/11/10.
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response;
        hashHistory.push("#");
        message.error("网络错误");
        throw error
    }
}

function parseJSON(response) {
    return response.json()
}
export default function (url, config) {
    console.log("fetch from " + url);
    /**
     * @param config 其他继承的配置
     */
    if(config===undefined) config={};
    let configs=Object.assign(config, {
        noCache: false,
        raw: false,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            "authorization":'Bearer '+sessionStorage.token,
        }
    });
    //  config = {
    //     noCache: false,
    //     raw: false,
    //     credentials: 'include',
    //     headers: {
    //         "authorization":'Bearer '+sessionStorage.token,
    //         'Content-Type': 'application/json',
    //     }
    // };
    return fetch(Strings.serverAddr + url, configs)
        .then(checkStatus)
        .then(parseJSON)
        .then(function(response) {
            console.log('request succeeded with JSON response', response);
            return response;
        }).catch(function(error) {
            console.log('request failed', error)
            return null;
        })
}

