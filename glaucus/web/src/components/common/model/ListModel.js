import React from 'react'
import {Menu, Pagination, Badge} from 'antd'
import * as _ from "underscore";
import '../../../styles/ListModels.css'
/**
 * Created by LXY on 2017/3/18.
 */

const SubMenu = Menu.SubMenu;
class ListModels extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
        this.onChange=this.onChange.bind(this);
    }

    handleClick(e) {
        console.log('click ', e);
        this.props.change_model(e.key);
    }

    onOpenChange(openKeys) {
        this.props.change_config(openKeys);
    }

    onChange(page){
        this.props.change_model_page(page);
    }

    render() {
        console.log(this.props.models);
        const modelArrays = _.groupBy(this.props.models, 'configId');
        let keyArray = [];
        for(var key in modelArrays){
            keyArray.push(key);
        }
        let start=(this.props.currentModelPage - 1) * 10;
        let end=this.props.currentModelPage * 10;
        let nowModel=keyArray.length===0?[]:keyArray.slice(start,end);
        let models = _.map(nowModel,(configId)=>{
            let configModel=modelArrays[configId];
            let badge=[];
            let menuItems = _.map(configModel, (item) => {
                badge =  <Badge status="success" />;
                if(item.trainedStatus ===1)
                    badge = <Badge status="success" />;
                else if(item.trainedStatus === -1)
                    badge = <Badge status="default" />;
                else
                    badge = <Badge status="processing" />;
                return (
                    <Menu.Item key={item.modelId}>
                        <div className="model-menu">{badge}{item.modelName}</div>
                    </Menu.Item>
                );
            });
            let config=this.props.models.filter(item=>(item.configId===configId))[0];
            return(
                <SubMenu key={config.configId} title={ <div className="model-menu">{config.configName}</div>}>
                    {menuItems}
                </SubMenu>
            );
        });

        return (
            <div className="menu-page">
                <h3 className="config-title">模型列表</h3>
                <div className="model-menu">
                    <Menu className="file-menu"
                          onClick={this.handleClick}
                          openKeys={this.props.openKeys}
                          selectedKeys={[this.props.modelId]}
                          onOpenChange={this.onOpenChange}
                          mode="inline">
                        {models}
                    </Menu>
                </div>
                <Pagination simple current={this.props.currentModelPage} onChange={this.onChange} total={keyArray.length}/>
            </div>
        );
    }
}

export default ListModels
