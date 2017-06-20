import Strings from '../../resources/values/string'
import Dimens from '../../resources/values/dimens'
import AppHeader from "../../utils/AppHeader";
import AppNotes from "../../utils/AppNotes";
import '../../resources/LoginForm.css';
import 'whatwg-fetch';
import React from 'react';
import { Card, Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { hashHistory } from 'react-router';
import {getUser} from '../../redux/actions/LoginAction'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Get from '../../utils/Get'
/**
 * Created by LXY on 2017/3/14.
 */

const FormItem = Form.Item;
class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const url = "/api/login?username=" + values.username +
                    "&password=" + values.password;
                Get(url).then(rsl => {
                    if (rsl != null) {
                        if( rsl['data'].loginStatus ){
                            this.props.getUser(rsl['data'].userId );
                            hashHistory.push("/app/" + rsl['data'].userId + "/fileManage/default");
                        }else{
                            message.warn("账号密码错误！");
                        }
                        // rsl['data'].loginStatus ?
                        //     hashHistory.push("/app/" + rsl['data'].userId + "/home/default") :
                        //     message.warn("账号密码错误！");
                    } else {
                        message.error("服务器出错！");
                    }
                });
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: Strings.userNameHint }],
                    })(
                        <Input addonBefore={<Icon type="user" />} placeholder={Strings.userNamePlaceHolder} />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: Strings.passwordHint }],
                    })(
                        <Input addonBefore={<Icon type="lock" />} type="password" placeholder={Strings.passwordPlaceHolder} />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>{Strings.userFormRemember}</Checkbox>
                    )}
                    <a className="login-form-forgot">忘记密码?</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        {Strings.userFormButton}
                    </Button>
                </FormItem>
            </Form>
        );
    }
}
LoginForm = Form.create()(LoginForm)

class LoginPage extends React.Component{
    render(){
        const getUser =  this.props.getUser;
        const height = (window.outerHeight) - Dimens.appNoteHeight - Dimens.appBarHeight - 110;
        return (
            <div>
                <AppHeader isLogin={true}/>
                <div className="login-form-div" style={{height:height}}>
                    <Card className="login-card"
                          title={Strings.loginTitle}
                          extra={<a href="#">注册</a>}>
                        <LoginForm getUser = {getUser}/>
                    </Card>
                </div>
                <AppNotes/>
            </div>
        );
    }
}


const mapStateToProps = state=>({
    loginManage:state.loginManage
});

const mapDispatchToProps = dispatch =>({
    getUser:bindActionCreators(getUser,dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(LoginPage)
