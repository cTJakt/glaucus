import Strings from '../../resources/values/string'
import Dimens from '../../resources/values/dimens'
import AppHeader from "../../utils/AppHeader";
import AppNotes from "../../utils/AppNotes";
import '../../resources/LoginForm.css';
import 'whatwg-fetch';
import React from 'react';
import { Card, Form, Icon, Input, Button, message,Modal,Checkbox,Col } from 'antd';
import { hashHistory } from 'react-router';
import {getUser,change_modal_visible,change_btn_spin} from '../../redux/actions/LoginAction'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Get from '../../utils/Get'
import Post from '../../utils/Post'
import Auth from '../../utils/Auth'
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
                const url = "/uerManage/login?username=" + values.username +
                    "&password=" + values.password;
                Get(url).then(rsl => {
                    if (rsl != null) {
                        if( rsl['data'].loginStatus ){
                            this.props.getUser(rsl['data'].userId,rsl['data'].jwtToken);
                            Auth.setToken(this.props.loginManage);
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
        let formFeatureListLayout = {
            wrapperCol: {
                span: 24,
            },
        };
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem {...formFeatureListLayout}>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: Strings.userNameHint }],
                    })(
                        <Input addonBefore={<Icon type="user" />} placeholder={Strings.userNamePlaceHolder}  style={{ width: '80%' }}/>
                    )}
                </FormItem>
                <FormItem {...formFeatureListLayout}>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: Strings.passwordHint }],
                    })(
                        <Input addonBefore={<Icon type="lock" />} type="password" placeholder={Strings.passwordPlaceHolder} style={{ width: '80%' }}/>
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
LoginForm = Form.create()(LoginForm);

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {       //注册 逻辑
        this.props.change_btn_spin(true);       //开始注册逻辑
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if(values.regPassword!==values.passwordSure){       //两次密码输入不一致
                    message.error("密码输入不一致");
                }else{
                    let user={
                        username:values.regUsername,
                        password:values.regPassword,
                    };
                    Post("/uerManage/register", JSON.stringify(user)).then(res=> {     //用户注册
                        if(res.status===200){
                            message.success("注册成功");
                            this.props.change_modal_visible(false);     //关闭对话框
                        }
                    });
                }
            }
        });
        this.props.change_btn_spin(false);       //结束注册逻辑
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        let {loading,disabled} = this.props;
        let formFeatureListLayout = {
            wrapperCol: {
                span: 24,
            },
        };
        return(<div className="modal-div">
            <Form onSubmit={this.handleSubmit} className="register-form">
                <FormItem {...formFeatureListLayout}>
                    {getFieldDecorator('regUsername', {
                        rules: [{ required: true, message: Strings.userNameHint }],
                    })(
                        <Input addonBefore={<Icon type="user" />} placeholder={Strings.userNamePlaceHolder}  style={{ width: '100%' }}/>
                    )}
                </FormItem>
                <FormItem {...formFeatureListLayout}>
                    {getFieldDecorator('regPassword', {
                        rules: [{ required: true, message: Strings.passwordHint }],
                    })(
                        <Input addonBefore={<Icon type="lock" />} type="password" placeholder={Strings.passwordPlaceHolder} style={{ width: '100%' }}/>
                    )}
                </FormItem>
                <FormItem {...formFeatureListLayout}>
                    {getFieldDecorator('passwordSure', {
                        rules: [{ required: true, message: Strings.passwordSureHint }],
                    })(
                        <Input addonBefore={<Icon type="lock" />} type="password" placeholder={Strings.passwordSureHint} style={{ width: '100%' }}/>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} disabled={disabled}>
                        {Strings.userRegister}
                    </Button>
                </FormItem>
            </Form>
        </div>);
    }
}
RegisterForm = Form.create()(RegisterForm);

class LoginPage extends React.Component{
    constructor(props){
        super(props);
        this.handelCloseOk=this.handelCloseOk.bind(this);
        this.handelCancel=this.handelCancel.bind(this);
        this.registerModal=this.registerModal.bind(this);
    }
    handelCloseOk(){  //点击空白处关闭注册对话框
        this.props.change_modal_visible(false);
        // this.props.analysisFields();
    }

    registerModal(){        //弹出对话框
        this.props.change_modal_visible(true);
    }

    handelCancel(){  //点击注册对话框取消按钮时
        this.props.change_modal_visible(false);
    }
    render(){
        let {modalVisible,regBtnSpin} = this.props.loginManage;
        const getUser =  this.props.getUser;
        const height = (window.outerHeight) - Dimens.appNoteHeight - Dimens.appBarHeight - 110;

        return (
            <div>
                <AppHeader isLogin={true}/>
                <div className="login-form-div" style={{height:height}}>
                    <Card className="login-card"
                          title={Strings.loginTitle}
                          extra={<a onClick={this.registerModal}>注册</a>}>
                        <LoginForm getUser = {getUser} loginManage={this.props.loginManage} />
                    </Card>
                </div>
                <div>
                <Modal
                    visible={modalVisible}
                    title="注册用户"
                    width="630"
                    onOk={this.handelCloseOk}
                    onCancel={this.handelCancel}
                    footer={[
                        <Button key="back" size="large" onClick={this.handelCancel}>取消</Button>,
                    ]}
                >
                <RegisterForm loading={regBtnSpin} disabled={regBtnSpin} change_modal_visible={this.props.change_modal_visible}
                              change_btn_spin={this.props.change_btn_spin}
                />
                </Modal>
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
    getUser:bindActionCreators(getUser,dispatch),
    change_modal_visible:bindActionCreators(change_modal_visible,dispatch),
    change_btn_spin:bindActionCreators(change_btn_spin,dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(LoginPage)
