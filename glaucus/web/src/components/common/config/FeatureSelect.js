import React from 'react';
import "../../../styles/FeatureSelect.css"
import { Select, Form, Input, Radio, Transfer, Tooltip, Alert, Button,notification} from 'antd';
import * as _ from "underscore";
import ReactEcharts from 'echarts-for-react';

/**
 * Created by LXY on 2017/3/19.
 */
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

//Step1 特征选择
class FeatureSelect extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getFileList = this.getFileList.bind(this);
        this.getFeature = this.getFeature.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.handleFeatureChange = this.handleFeatureChange.bind(this);
        this.handleModelTypeNameChange = this.handleModelTypeNameChange.bind(this);
        this.handleSelectWayChange = this.handleSelectWayChange.bind(this);
        this.handProduceFeature=this.handProduceFeature.bind(this);
        this.getMethod=this.getMethod.bind(this);
        this.showFeatureResult=this.showFeatureResult.bind(this);
        this.getObjectFields=this.getObjectFields.bind(this);
    }

    handleFeatureChange(targetKeys) {
        console.log(targetKeys);
        // this.setState({ targetKeys });
        this.props.feature_change(targetKeys);
    }
    componentDidMount() {
        this.getFileList();
        const fileInfoId = this.props.fileInfoId;
        if (!_.isUndefined(fileInfoId) && fileInfoId !== 'addConfig') {
            this.getFeature(fileInfoId)
            // this.props.file_select(fileInfoId);
        }
    }
    getFileList() {
        this.props.get_files(this.props.userId);
    }
    handleFileSelect(value) {
        console.log("get fileId: " + value);
        this.getFeature(value);
    }
    getFeature(fileId) {
        this.props.get_features(fileId);
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log(e);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.setConfigInfos(values,this.props.featureList);
            }
        });
    }
    handleModelTypeNameChange(e) {
        this.props.change_model_type(e.target.value);
    }

    handleSelectWayChange(e){
        this.props.change_select_way(e.target.value);
        this.props.feature_change([]);          //当特征选择方式变化时，先重置选择的特征字段
    }

    handProduceFeature(){          //选择目标量后生成训练量
        let targets = this.props.targetKeys;
        if(targets.length===0){     //未选择目标量
            notification["error"]({
                message: "！！！",
                description: '请先选择目标字段！',
            })
        }else if(targets.length>1){     //已经生成过
            notification["error"]({
                message: "！！！",
                description: '目标字段只能有一个！',
            })
        }else{
            this.props.change_btn_state(true);
            this.props.change_feature_spin(true);
            let fieldName=this.props.featureList.filter((item)=>((item.key === targets[0])))[0].fieldName;
            this.props.auto_feature(this.props.methodId,targets[0],this.props.fileId,fieldName);  //id
        }
    }

    getMethod(method){      //获取选择的选择方法
        this.props.select_method(method);
    }

    showFeatureResult(result){      //使用柱状图展示结果
        let xData=[];
        let yData=[];
        let yMax=0;
        for(let i=0;i<result.length;i++){
            xData.push(result[i].fieldName);
            yData.push(result[i].value);
            if(result[i].value>yMax)
                yMax=result[i].value;
        }
        let divResult=[];
        let option = {
            title: {
                text: '特征信息熵'
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0]
                }
            ],
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
            xAxis: {
                type: 'category',
                name: '字段名',
                boundaryGap : false,
                data: xData
            },
            yAxis: {
                type: 'value',
                name: '信息熵'
            },
            series: [
                {
                    name: '信息熵',
                    type: 'line',
                    areaStyle: {normal: {}},
                    data: yData,
                }
            ]
        };
        divResult.push(<ReactEcharts
            option={option}
            style={{height: '350px', width: '100%'}}
            className='react_for_echarts' />);
        return divResult;
    }

    getObjectFields(value){      //全部自动训练时，选择目标字段
        this.props.select_field(value);
    }

    render(){
        let { getFieldDecorator } = this.props.form;
        let featureSelectWay = this.props.featureSelectWay;

        //form layout
        let formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: { span: 8},
        };
        let formFeatureListLayout = {
            labelCol: { span: 3},
            wrapperCol: { span: 20},
        };
        //form rules and initial values
        let configNameConfig = {
            rules: [{ required: true, message: '请输入配置名!' }],
        };
        let fileConfig = {
            rules: [{ required: true, message: '请选择文件!' }]
        };
        let modelTypeConfig = {
            rules: [{ required: true, message: '请选择分类模型!' }],
            initialValue: "classification"
        };
        let featureConfig = {
            rules: [{ type: 'array', required: true, message: '请选择模型特征!' }],
        };
        //get file choose initial value
        if (this.props.fileId !== null) fileConfig["initialValue"] = this.props.fileId;

        let selectWay={
            rules: [{ required: true, message: '请选择特征生成方式!' }],
            initialValue: "selfSelect"
        };

        let methodSelect = {
            rules: [{ required: true, message: '请选择方法!' }],
        };
        let modelNameConfig = {
            rules: [{ required: true, message: '请输入模型名!' }],
        };
        let fieldfSelect = {
            rules: [{ required: true, message: '请选择目标字段!' }],
        };
        if (this.props.objectField === null) {
            fieldfSelect["value"] = null;
        }

        let selectItem=[];
        let produceFeature=[];
        //select ways
        if(this.props.modelType==="classification"){
            selectItem=<FormItem {...formItemLayout} label="选择训练特征: ">
                {getFieldDecorator('selectWay', selectWay)(
                    <RadioGroup onChange={this.handleSelectWayChange}>
                        <Radio value="selfSelect">手动选择</Radio>
                        <Radio value="autoSelect">自动选择</Radio>
                    </RadioGroup>
                )}
            </FormItem>
        }else{
            selectItem=null;
        }

        //select items
        let selectFileOptions = this.props.files.map(file => {
            return (
                <Option value={file.fileId}>
                    {file.fileName}
                </Option>
            );
        });
        // selectFileOptions.push(<Option value="image">
        //     mnist
        // </Option>);
        //transfer items
        const renderItem = item => {
            const customLabel = (
                <span>
                    {item.title} - {item.fieldType}
                </span>
            );
            return {
                label: customLabel,  // for displayed item
                value: item.title,   // for title and filter matching
            };
        };
        //hint of classification values
        const modelHint = _.filter(this.props.featureList, info => info.key === this.props.targetKeys[this.props.targetKeys.length-1])
        const modelHintValue = this.props.modelType !== 'cluster' ?             //分类和回归都有目标量
            <FormItem {...formFeatureListLayout} label="模型目标字段为: " style={{marginTop:"0px"}}>
                {getFieldDecorator('keyFeature')(
                    <a>{_.isUndefined(modelHint[0]) ? "" : modelHint[0].title}</a>
                )}
            </FormItem> :
            [];
        //radio model type hint
        let modelSelectHint = [];
        let selectMethod=[];    //特征工程的方法
        if(this.props.modelType==="classification"){
            if(featureSelectWay!=="autoSelect")
                modelSelectHint=<Alert className="alert-info" message="您下列选择的第一个字段为分类模型的目标字段" type="info" showIcon closeText="知道了"/>;
            else{
                modelSelectHint=<Alert className="alert-info" message="使用自动选择时只需要选择一个目标字段" type="info" showIcon closeText="知道了"/>;
                if(this.props.targetKeys.length===1) {
                    produceFeature = <FormItem wrapperCol={{span: 12, offset: 3}}>
                        <Button type="dashed" style={{marginLeft: ""}} onClick={this.handProduceFeature} loading={this.props.btnLoading}>生成训练特征</Button>
                    </FormItem>
                }
                selectMethod=<FormItem {...formItemLayout} label="选择生成特征的方法: ">
                    {getFieldDecorator('methodId', methodSelect)(
                        <Select placeholder="请选择方法" onChange={this.getMethod}>
                            <Option value="ChiSqSelector">ChiSqSelector</Option>
                            <Option value="RL">RandomizedLasso</Option>
                            <Option value="RF">RandomForest</Option>
                        </Select>
                    )}
                </FormItem>
            }
        }else if(this.props.modelType==="cluster"){
            modelSelectHint=[];
        }else{
            modelSelectHint=<Alert className="alert-info" message="您下列选择的第一个字段为回归模型的目标字段" type="info" showIcon closeText="知道了"/>;
        }

        let info=[];
        if(this.props.modelType==="dl"){        //全自动训练，自动选参选模型
            let selectFields=this.props.featureList.map(item => {
                return (
                    <Option value={item.key}>
                        {item.fieldName}-{item.fieldType}
                    </Option>
                );
            });
            info=<div>
                <FormItem {...formItemLayout} label="选择目标字段: ">
                    {getFieldDecorator('objectField', fieldfSelect)(
                        <Select placeholder="请选择目标字段" onChange={this.getObjectFields}>
                            {selectFields}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="模型名称: ">
                    {getFieldDecorator('modelName', modelNameConfig)(
                        <Input placeholder="请输入新的模型名称" />
                    )}
                </FormItem>
            </div>;
        }else{
            info=<div>
                {selectItem}
                {modelSelectHint}
                <FormItem {...formFeatureListLayout} label="选择特征字段: ">
                    {getFieldDecorator('featureList', featureConfig)(
                        <Transfer
                            dataSource={this.props.featureList}
                            showSearch
                            listStyle={{
                                width: 250,
                                height: 300,
                            }}
                            operations={['添加特征', '删除特征']}
                            targetKeys={this.props.targetKeys}
                            onChange={this.handleFeatureChange}
                            render={renderItem}
                        />
                    )}
                </FormItem>
                {modelHintValue}{produceFeature}
            </div>
        }

        let featureResultImage=[];
        if(this.props.featureResult.length>0){          //使用RL和RF的方法时，将选择的结果和信息熵用图展示
            featureResultImage=this.showFeatureResult(this.props.featureResult);
        }
        return (
            <div>
                <Form onSubmit={this.handleSubmit}  style={{marginTop:"50px"}}>
                    <FormItem {...formItemLayout} label="配置名称: ">
                        {getFieldDecorator('confName', configNameConfig)(
                            <Input placeholder="请输入新的配置名称" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选择文件: ">
                        {getFieldDecorator('fileId', fileConfig)(
                            <Select placeholder="请选择文件" onChange={this.getFeature}>
                                {selectFileOptions}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选择模型类别: ">
                        {getFieldDecorator('modelTypeName', modelTypeConfig)(
                            <RadioGroup onChange={this.handleModelTypeNameChange}>
                                <Radio value="classification">分类</Radio>
                                <Radio value="cluster">聚类</Radio>
                                <Radio value="regression">回归</Radio>
                                <Radio value="dl">自动化分类器</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {selectMethod}
                    {info}
                    {featureResultImage}
                    <FormItem wrapperCol={{ span: 12, offset: 3 }}>
                        <Button style={{marginLeft:""}} type="primary" htmlType="submit">保存内容</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
FeatureSelect = Form.create()(FeatureSelect);
export default FeatureSelect;