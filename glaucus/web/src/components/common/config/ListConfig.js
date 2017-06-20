import React from 'react'
import {Button, Icon, Menu, Pagination} from 'antd'
import * as _ from "underscore";
import '../../../styles/ListConfigs.css'
/**
 * Created by LXY on 2017/3/17.
 */


const SubMenu = Menu.SubMenu;
class ListConfigs extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
        this.handleAddConfigClick = this.handleAddConfigClick.bind(this);
        this.onChange=this.onChange.bind(this);
    }
    handleClick(e) {
        console.log('click ', e);
        this.props.getConfigChange(e.key);
    }

    onOpenChange(openKeys) {
        this.props.change_file(openKeys);
    }

    handleAddConfigClick() {
        // this.setState({
        //     current: ""
        // })
        this.props.changeToAddConfig();
    }

    onChange(page){
        this.props.change_config_menu(page);
    }

    render() {
        let myPageSize=20;
        console.log(this.props.configArrays);
        let configArrays = _.groupBy(this.props.configArrays, 'fileId');
        let keyArray = [];
        for(let key in configArrays){
            keyArray.push(key);
        }
        let start=(this.props.currentConfigPage - 1) * myPageSize;
        let end=this.props.currentConfigPage * myPageSize;
        let nowConfig=keyArray.length===0?[]:keyArray.slice(start,end);
        let configs = _.map(nowConfig,(fileId)=>{
            let fileConfig=configArrays[fileId];
            let menuItems = _.map(fileConfig, (item) => (
                <Menu.Item key={item.configId}>
                    <div className="config-menu">{item.confName}</div>
                </Menu.Item>));
            let nowFile=this.props.configArrays.filter(item=>(item.fileId===fileId))[0];
            return(
                <SubMenu key={nowFile.fileId} title={<div className="config-menu">{nowFile.fileName}</div>}>
                    {menuItems}
                </SubMenu>
            );
        });
        // let configs = _.map(nowConfig, (config, fileId) => {
        //     let menuItems = _.map(config, item => (
        //         <Menu.Item key={item.configId}>
        //             {item.confName}
        //         </Menu.Item>));
        //     return (
        //         <SubMenu key={config[0].fileId} title={config[0].fileName}>
        //             {menuItems}
        //         </SubMenu>
        //     );
        // })
        return (
            <div className="menu-page">
                <h3 className="config-title">配置列表</h3>
                <div className="config-button-box">
                    <Button type="dashed" onClick={this.handleAddConfigClick}><Icon type="plus" />新增配置</Button>
                </div>
                <Menu className="file-menu"
                      openKeys	={this.props.openKeys}
                      onClick={this.handleClick}
                      onOpenChange={this.onOpenChange}
                      selectedKeys={[this.props.configId]}
                      mode="inline">
                    {configs}
                </Menu>
                <Pagination simple current={this.props.currentConfigPage} pageSize={myPageSize} onChange={this.onChange}  total={keyArray.length} />
            </div>
        );
    }
}
export default ListConfigs