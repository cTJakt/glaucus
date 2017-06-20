import React from 'react'
import {Form, Table, Button, Modal} from 'antd'
import * as _ from "underscore";
/**
/**
 * Created by LXY on 2017/3/19.
 */
const FormItem = Form.Item;
const confirm = Modal.confirm;
const modelTypeDic = {
    "classification": "分类模型",
    "cluster"    : "聚类模型",
    "regression":"回归模型",
    "dl":"深度学习"
}
class ModelArgumentTable extends React.Component {
    render() {
        console.log("data: " + JSON.stringify(this.props.data));
        const columns = [{
            title: '参数名称',
            key: 'argName',
            dataIndex: 'argName',
        }, {
            title: '参数值',
            key: 'argValue',
            dataIndex: 'argValue'
        }];
        return (
            <Table columns={columns} dataSource={this.props.data} />
        );
    }
}

class FeatureTable extends React.Component {
    render() {
        console.log("data: " + JSON.stringify(this.props.data));
        const columns = [{
            title: '特征',
            key: 'featureName',
            dataIndex: 'featureName',
        }, {
            title: '特征属性',
            key: 'featureAttribute',
            dataIndex: 'featureAttribute'
        }];
        return (
            <Table columns={columns} dataSource={this.props.data} />
        );
    }
}
class ConfigInfoConfirm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(e);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const submitInfos = this.props.submitInfos;
                confirm({
                    title: '您已确认所有信息?',
                    content: '已经确认所有信息？',
                    okText: "确认并开始训练",
                    onOk() {
                        console.log('OK');
                        submitInfos();
                    },
                    onCancel() {

                    },
                });
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        //form layout
        const formItemLayout = {
            labelCol: { span: 3},
            wrapperCol: { span: 6},
        };
        const formTableLayout = {
            labelCol: { span: 3},
            wrapperCol: { span: 12},
        };

        let targetKeys=this.props.targetKeys;
        let featureList1=this.props.featureList;
        let trainFeatureList=this.props.trainFeatureList;

        let trainFeatureInfo = [];
        if(targetKeys.length>0){
            trainFeatureInfo = featureList1.filter(function (item) {
                let info = [];
                for(let i = 0; i<targetKeys.length;i++){
                    if(item.key === targetKeys[i]){
                        info.push({
                            "fieldName":item.title,
                        });
                        return item;
                    }
                }
            });
        }else{
            trainFeatureInfo = featureList1.filter(function (item) {
                let info = [];
                for(let i = 0; i<trainFeatureList.length;i++){
                    if(item.key === trainFeatureList[i]){
                        info.push({
                            "fieldName":item.title,
                        });
                        return item;
                    }
                }
            });
        }

        /* initial table data */
        let featureListTableData = [];
        if(this.props.modelTypeName!=="cluster"){
            for(let i=0;i<trainFeatureInfo.length;i++){
                let tmp = trainFeatureInfo[i];
                if(this.props.objectFeature===tmp.key){
                    featureListTableData.push({
                        "featureName" : tmp.fieldName,
                        "featureAttribute": "目标量"
                    });
                }else{
                    featureListTableData.push({
                        "featureName" : tmp.fieldName,
                        "featureAttribute": "训练量"
                    });
                }
            }
        }else{
            for(let i=0;i<trainFeatureInfo.length;i++) {
                let tmp = trainFeatureInfo[i];
                featureListTableData.push({
                    "featureName": tmp.fieldName,
                    "featureAttribute": "训练量"
                });
            }
        }
        const modelArgs = this.props.modelArguments
        console.log(modelArgs);
        const modelArgumentsTableData = _.map(modelArgs, info => {
            return {
                "argName": info['argName'],
                "argValue": info['argValue']
            }
        });
        let info=[];
        if(this.props.fileId!=="image"){
           info= <FormItem {...formTableLayout} label="选择字段: ">
                {getFieldDecorator('modelDetailName')(
                    <FeatureTable data={featureListTableData}/>
                )}
            </FormItem>
        }
        return (
            <Form onSubmit={this.handleSubmit}  style={{marginTop:"50px"}}>
                <FormItem {...formItemLayout} label="配置名称: ">
                    {getFieldDecorator('confName')(
                        <span>{this.props.confName}</span>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="模型名称: ">
                    {getFieldDecorator('modelName')(
                        <span>{this.props.modelName}</span>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="模型类型: ">
                    {getFieldDecorator('modelTypeName')(
                        <span>{modelTypeDic[this.props.modelTypeName]}</span>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="具体模型: ">
                    {getFieldDecorator('modelDetailName')(
                        <span>{this.props.modelDetailName}</span>
                    )}
                </FormItem>
                <FormItem {...formTableLayout} label="模型参数: ">
                    {getFieldDecorator('modelArgument')(
                        <ModelArgumentTable data={modelArgumentsTableData}/>
                    )}
                </FormItem>
                {info}
                <FormItem wrapperCol={{ span: 12, offset: 3 }}>
                    <Button type="primary" htmlType="submit">确认信息</Button>
                </FormItem>
            </Form>
        );
    }
}
ConfigInfoConfirm = Form.create()(ConfigInfoConfirm)
export default ConfigInfoConfirm;
