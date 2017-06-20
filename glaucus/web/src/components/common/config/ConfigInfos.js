import React from 'react';
import '../../../styles/ConfigInfo.css'
import {Table, Button, Icon,Spin, Tooltip,Popconfirm} from 'antd'
import * as _ from "underscore";
/**
 * Created by LXY on 2017/3/17.
 */
let trainDic = {
    "1": "已训练",
    "0": "训练中",
    "-1": "未训练"
};
class ConfigTable extends React.Component {
    render() {
        const columns = [{
            title: '特征字段',
            key: 'featureName',
            dataIndex: 'featureName',
            width:'40%'
        },{
            title:'字段描述',
            key:'featureAttribute',
            dataIndex: 'featureAttribute',
            width:'30%'
        },{
            title:'字段类型',
            key:'fieldType',
            dataIndex: 'fieldType',
            width:'30%'
        }];
        return (
            <Table className="file-table" columns={columns} dataSource={this.props.data} />
        );
    }
}

class ModelTable extends React.Component{
    render() {
        const columns = [{
            title: '模型',
            key: 'modelName',
            dataIndex: 'modelName',
            width:'40%'
        }, {
            title: '模型具体名称',
            key: 'modelDetailName',
            dataIndex:'modelDetailName',
            width:'30%'
        },{
            title: '是否训练',
            key: 'trainedStatus',
            dataIndex: 'trainedStatus',
            width:'30%',
            render: (text, record, index) => trainDic[record.trainedStatus.toString()]
        }];
        return (
            <Table className="file-table" columns={columns}  dataSource={this.props.modelData}/>
        );
    }
}

class ConfigInfos extends React.Component {
    constructor(props) {
        super(props);
        this.handleAddModel = this.handleAddModel.bind(this);
        this.confirmeDeleteConfig = this.confirmeDeleteConfig.bind(this);
    }
    handleAddModel() {
        this.props.addConfig();
    }

    confirmeDeleteConfig(){
        this.props.deleteConfig(this.props.configId);
    }

    render(){
        let featureListTableData = [];
        let data = this.props.configDetail.slice(0);
        if (this.props.modelTypeName === 'classification' ||this.props.modelTypeName === 'regression'||this.props.modelTypeName==='dl') {
            featureListTableData.push({
                "featureName" : data.slice(0).pop().fieldName,
                "featureAttribute": "目标量",
                "fieldType":data.pop().fieldType
            })
        }
        _.each(data, feature => {
            featureListTableData.push({
                "featureName" : feature.fieldName,
                "featureAttribute": "训练量",
                "fieldType":feature.fieldType
            })
        });
        let modelData = this.props.modelData;
        let configName = this.props.configName;
        //const modelTypeId = this.props.modelTypeId;
        let modelTypeName = "";

        if(this.props.modelTypeName==="classification"){
            modelTypeName="分类";
        }else if(this.props.modelTypeName==="cluster"){
            modelTypeName="聚类";
        }else if(this.props.modelTypeName==="regression"){
            modelTypeName="回归";
        }else  if(this.props.modelTypeName==="dl"){
            modelTypeName="自动化分类器";
        }

        let fileName = this.props.fileName;
        let disabled = this.props.configId===""?true:false;
        let modelDes = this.props.modelDes;
        let deleteConfirm = "删除这个配置会包括删除这个配置下所有的模型,确认删除这个配置吗?";
        return (
            <article className="article-page">
                <div className="article-title">
                    <h1 style={{width:"20%"}}>{configName}</h1>
                    <div className="button-box">
                        <Button type="dashed" className="button-config" disabled={disabled} onClick={this.handleAddModel}><Icon type="edit" />增加模型</Button>
                        <Popconfirm placement="bottom"
                                    title={deleteConfirm}
                                    onConfirm={this.confirmeDeleteConfig}
                                    okText="确认"
                                    cancelText="取消">
                            <Button type="primary" className="button-delete" disabled={disabled}><Icon type="delete" />删除配置</Button>
                        </Popconfirm>
                    </div>
                </div>
                <p className="subtitle">文件名：{fileName}</p>
                <p className="subtitle">模型类型：
                    <Tooltip title={modelDes} placement="right">
                        <a>{modelTypeName}</a>
                    </Tooltip>
                </p>
                <div className="file-table-div">
                    <Spin spinning={this.props.configPageSpin}>
                        <h3>特征字段</h3>
                        <ConfigTable data={featureListTableData}/>
                        <h3>配置训练模型</h3>
                        <ModelTable modelData={modelData}/>
                    </Spin>
                </div>
            </article>
        );
    }
}

export default ConfigInfos