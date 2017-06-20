/**
 * Created by LXY on 2017/5/1.
 */
import * as _ from "underscore";
import Strings from '../resources/values/string'
import 'whatwg-fetch'

/** 网络请求街口
 * server class
 * Created by lucas on 2016/11/10.
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
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
    _.defaults(config, {
        noCache: false,
        raw: false,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors'
    });
    return fetch(Strings.dlServerAddr + url, config)
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

