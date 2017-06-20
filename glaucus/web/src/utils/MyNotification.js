import {notification,Button,Icon} from 'antd'
import React from 'react'

/**
 * Created by LXY on 2017/3/26.
 */
const close = () => {
    console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
};

export default function (icon,message,description){
    const key = `open${Date.now()}`;
    const btnClick = function () {
        // to hide notification box
        notification.close(key);
    };
    const btn = (
        <Button type="primary" size="small" onClick={btnClick}>
            确认
        </Button>
    );
    let myIcon = "";
    if(icon === 'success')
        myIcon="smile-circle";
    else
        myIcon="frown";

    notification.open({
        message: message,
        description: description,
        btn,
        key,
        onClose: close,
        duration:null,
        icon: <Icon type={myIcon}   style={{ color: '#108ee9' }} />,
    });
};

