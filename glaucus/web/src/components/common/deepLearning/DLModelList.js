import React from 'react';
import {Button,Badge,Menu,Pagination,Row,Col} from 'antd';
import '../../../styles/ListModels.css'
import * as _ from "underscore";
import { hashHistory } from 'react-router';


/**
 * Created by LXY on 2017/6/18.
 */
let SubMenu=Menu.SubMenu;
class DLModelList extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
        this.onChange=this.onChange.bind(this);
        this.addDLModel = this.addDLModel.bind(this);
    }

    handleClick(e) {
        this.props.get_the_model(e.key);
    }

    addDLModel(){       //跳转到dm模型添加界面
        hashHistory.push("/app/"+ this.props.userId +"/deepLearning"+"/addModel");
    }
    onOpenChange(openKeys) {
        this.props.change_select_file(openKeys);
    }

    onChange(page){
        this.props.change_dl_model_page(page);
    }

    render() {
        const modelArrays = _.groupBy(this.props.models, 'fileId');
        let keyArray = [];
        for(var key in modelArrays){
            keyArray.push(key);
        }
        let start=(this.props.currentModelPage - 1) * 10;
        let end=this.props.currentModelPage * 10;
        let nowModel=keyArray.length===0?[]:keyArray.slice(start,end);
        let models = _.map(nowModel,(fileId)=>{
            let fileModel=modelArrays[fileId];
            let badge=[];
            let menuItems = _.map(fileModel, (item) => {
                let flag=-1;
                if(item.train && item.hasResult===true){
                    flag = 1;
                }else if(item.train && item.hasResult===false){
                    flag = 0;
                }else{
                    flag = -1;
                }
                badge =  <Badge status="success" />;
                if(flag ===1)
                    badge = <Badge status="success" />;
                else if(flag === -1)
                    badge = <Badge status="default" />;
                else
                    badge = <Badge status="processing" />;
                return (
                    <Menu.Item key={item.modelId}>
                        <div className="model-menu">{badge}{item.modelName}</div>
                    </Menu.Item>
                );
            });
            let file=this.props.models.filter(item=>(item.fileId===fileId))[0];
            return(
                <SubMenu key={file.fileId} title={ <div className="model-menu">{file.fileName}</div>}>
                    {menuItems}
                </SubMenu>
            );
        });

        return (
            <div className="menu-page">
                <h3 className="config-title">模型列表</h3>
                <div className="add-model-btn">
                    <Button type="primary" icon="plus" onClick={this.addDLModel}>添加模型</Button>
                </div>
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

export default DLModelList;