import React from 'react'
import logo from './logo.svg'
import Strings from '../resources/values/string'
import Dimens from '../resources/values/dimens'
import {Row, Col, Menu} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import "./AppHeader.css"
import { hashHistory } from 'react-router';
import {changePage} from '../redux/actions/AppHeaderActions'
import {init_file} from '../redux/actions/FileManage'
import {init_info} from '../redux/actions/Config'
/**
 * Created by LXY on 2017/3/14.
 */

class AppMenu extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        console.log('click ', e);
        if(this.props.pageKey==="fileManage"){
            this.props.init_file();
        }else if(this.props.pageKey==="config"){
            this.props.init_info();
        }
        this.props.changePage(e.key);
        hashHistory.push("/app/"+ this.props.userId +"/"+e.key+"/default");
    }

    render() {
        return (
            <Menu className="menu"
                  onClick={this.handleClick}
                  selectedKeys={[this.props.pageKey]}
                  mode="horizontal"
                  theme="dark">
                <Menu.Item key="fileManage" className="menu-item">
                    {Strings.menuItem1}
                </Menu.Item>
                <Menu.Item key="config" className="menu-item">
                    {Strings.menuItem2}
                </Menu.Item>
                <Menu.Item key="model" className="menu-item">
                    {Strings.menuItem3}
                </Menu.Item>
                <Menu.Item key="deepLearning" className="menu-item">
                    {Strings.menuItem4}
                </Menu.Item>
            </Menu>
        );
    }
}

class AppHeader extends React.Component {
    render() {
        const {headerManage,changePage} = this.props;
        const key = headerManage.key;
        // const userId = loginManage.userId;
        const isLogin = this.props.isLogin;
        const barColor = isLogin ? "white" : "#404040";
        const menu = !isLogin ? <AppMenu userId={this.props.userId} tag={this.props.tag} pageKey={key} changePage={changePage} init_info={this.props.init_info}
                                         init_file = {this.props.init_file}
        /> : null;
        return (
            <Row type="flex" align="middle" style={{height: Dimens.appBarHeight + 'px', backgroundColor: barColor}}>
                <Col offset={1}>
                    <a className="header-logo-div" href="#">
                        <img src={logo} className="header-logo" alt="logo"/>
                        <span className="app-name">{Strings.appName.toUpperCase()}</span>
                    </a>
                </Col>
                <Col offset={12}>
                    {menu}
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state=>({
    headerManage:state.headerManage,
    // configManage:state.configManage,
    // fileManage:state.fileManage,
});

const mapDispatchToProps = dispatch =>({
    changePage:bindActionCreators(changePage,dispatch),
    init_info:bindActionCreators(init_info,dispatch),
    init_file:bindActionCreators(init_file,dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(AppHeader)