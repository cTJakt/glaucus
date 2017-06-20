import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Select, Form, Input, Table, Tooltip, Button, Icon, InputNumber,message,notification,Spin} from 'antd';
import * as _ from "underscore";
import {hashHistory} from 'react-router'
import {changePage} from '../../redux/actions/AppHeaderActions'
import {get_dl_models,get_dl_files,change_file,change_model,update_args} from '../../redux/actions/AddDLModelAction'
import Post from '../../utils/Post'
import Get from '../../utils/Get'
import DLGet from '../../utils/DLGet'
import MyNotification from '../../utils/MyNotification'
import "../../resources/AddDLModel.css"
/**
 * Created by LXY on 2017/6/7.
 */
const FormItem = Form.Item;
const Option = Select.Option;
class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.check = this.check.bind(this);
        this.edit = this.edit.bind(this);
    }

    handleChange = (value) => {
        this.props.update_arg_value(value);
    };
    check = () => {
        this.props.onChange(this.props.value);
    };
    edit = () => {
        this.props.update_edit_true(); //将所选单元格设置为可编辑
    };
    render() {
        let { value,editable, valueType,range} = this.props;
        let step = valueType === "Int" ? 1 : 0.1;
        return (<div className="editable-cell">
            {editable ?
                <div className="editable-cell-input-wrapper">
                    <InputNumber
                        min={range[0]}
                        max={range[1]}
                        step={step}
                        defaultValue={value}
                        onChange={this.handleChange}
                        onPressEnter={this.check}/>
                    <Icon
                        type="check"
                        className="editable-cell-icon-check"
                        onClick={this.check}/>
                </div>
                :
                <div className="editable-cell-text-wrapper">
                    <span> {value || ' '} </span>
                    <Icon
                        type="edit"
                        className="editable-cell-icon"
                        onClick={this.edit}/>
                </div>
            }
        </div>);
    }
}

class ModelArgumentsTable extends React.Component {
    constructor(props){
        super(props);
        this.onCellChange = this.onCellChange.bind(this);
        this.cellChangeEdit = this.cellChangeEdit.bind(this);
        this.changeValue = this.changeValue.bind(this);
    }

    onCellChange(index, key) {//更新数据并将单元格的editable设置为false

        return (value) => {
            const dataSource = this.props.dataSource;
            dataSource[index][key] = value;
            dataSource[index]['editable'] = false
            console.log("modelArgsDataSource: " + JSON.stringify(dataSource));
            this.props.update_edit_true(dataSource); //更新数据并将单元格的editable设置为false
        };
    }

    cellChangeEdit(index,key){  //将所选单元格的editable属性设置为true
        return()=>{
            const dataSource = this.props.dataSource;
            dataSource[index]['editable'] = true
            console.log("modelArgsDataSource: " + JSON.stringify(dataSource));
            this.props.update_edit_true(dataSource);
        }
    }

    changeValue(index,key){ //更新单元格的数据
        return(value)=>{
            const dataSource = this.props.dataSource;
            dataSource[index][key] = value;
            dataSource[index]['editable'] = true
            console.log("modelArgsDataSource: " + JSON.stringify(dataSource));
            this.props.update_arg_value(dataSource);
        }
    }

    render() {
        console.log("data: " + JSON.stringify(this.props.dataSource));
        const columns = [{
            title: '参数名',
            key: 'argName',
            dataIndex: 'argName',
            width: "20%"
        }, {
            title: '参数值',
            key: 'argValue',
            dataIndex: 'argValue',
            width: "15%",
            // colSpan:0,
            render: (text, record, index) => {
                //const textValue = valueType === "Int" ? parseInt(text) : parseFloat(text);
                const valueType = record.argType;
                const range = _.map(record.argRange, num =>
                    valueType === "Int" ? parseInt(num) : parseFloat(num)
                )
                const theText = record.argValue;
                const editable = record.editable;
                //console.log("hehe: " + valueType + " " + range);
                return ( <EditableCell
                    valueType={valueType}
                    range={range}
                    value={text}
                    onChange={this.onCellChange(index, 'argValue')}
                    modelId={this.props.modelId}
                    modelArguments ={this.props.modelArguments}
                    editable={editable}
                    update_edit_true={this.cellChangeEdit(index,'editable')}
                    update_arg_value={this.changeValue(index,'argValue')}
                />)
            },
        }, {
            title: '参数范围',
            key: 'argRange',
            dataIndex: 'argRange',
            width: "15%",
            render: (text) => {
                const range = text[0] + "~" + text[1];
                return (<a>{range}</a>)
            }
        }, {
            title: '参数说明',
            key: 'argDes',
            dataIndex: 'argDes',
            width: "40%"
        }];
        return (
            <Table columns={columns} dataSource={this.props.dataSource} bordered/>
        );
    }
}

class AddDLModel extends React.Component {
    constructor(props) {
        super(props);
        this.getModels = this.getModels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getModelInfos = this.getModelInfos.bind(this);
        this.addModelArguments = this.addModelArguments.bind(this);
        this.getFile=this.getFile.bind(this);
        this.trainTheModel=this.trainTheModel.bind(this);
    }
    componentWillMount(){
    }
    componentDidMount() {
        this.getModels();
    }
    getModels() {
        this.props.get_dl_files(this.props.userId);
        this.props.get_dl_models(); //获取该模型分类下的所有模型及其参数
    }
    getModelInfos(modelId) {
        console.log("choose modelId = " + modelId);
        this.props.change_model(modelId,this.props.addDLModelManage.dlModels);
    }
    addModelArguments(values) {
        this.props.update_args(values);
    }

    getFile(fileId){
        this.props.change_file(fileId);
    }

    trainTheModel(modelName,modelId){
        DLGet("/api/model/dl/train?modelId=" + modelId).then(res => {
            console.log("addModel: " + res);
            if (res.status !==200) {
                if (res['data']) {
                    //3. train the Model
                    MyNotification('success',modelName,"模型训练成功");
                } else {
                    MyNotification('error',modelName,"模型训练失败，请重试");
                }
            } else {
                message.error("服务器出错，请重试");
            }
        })
    }

    handleSubmit(e) {   //保存模型，成功则开始训练模型并返回模型显示界面
        e.preventDefault();
        console.log(e);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let addDLModelManage=this.props.addDLModelManage;
                const defaultModelArguments = addDLModelManage.nowArguments.reduce((prev, cur) => {
                    prev[cur.argName] = cur.argValue;
                    return prev;
                }, {});
                let dlModel={
                    modelTypeId:addDLModelManage.dlModelId,
                    modelName:values.modelName,
                    picFileId:addDLModelManage.fileId,
                    arguments:defaultModelArguments,
                    // isTrained:false,
                    // modelPath:""
                };
                Post("/api/model/add/dl", JSON.stringify(dlModel)).then(res => {
                    console.log(res);
                    if (res !== null) {
                        //3. train the Model
                        notification["info"]({
                            message: values.modelName,
                            description: '开始训练',
                        });
                        this.trainTheModel(values.modelName,res['data']);

                        hashHistory.push("/app/"+ this.props.userId +"/deepLearning"+"/model");     //返回模型界面
                    } else {
                        message.error("添加模型信息出错，请重试");
                    }
                });
            }
        });
    }
    render() {
        let {nowArguments,dlModels,fileId,dlModelId,files}=this.props.addDLModelManage;
        let model=dlModels.filter((item) => (item.id === dlModelId))[0];
        const { getFieldDecorator } = this.props.form;
        //form layout
        const formItemLayout = {
            labelCol: { span: 3},
            wrapperCol: { span: 12},
        };
        const formTableLayout = {
            labelCol: { span: 3},
            wrapperCol: { span: 26},
        };
        //form rules and initial values
        const modelNameConfig = {
            rules: [{ required: true, message: '请输入配置名!' }],
        };
        const modelDetailNameConfig = {
            rules: [{ required: true, message: '请选择具体模型!' }],
        };
        const fileConfig = {
            rules: [{ required: true, message: '请选择文件!' }],
        };

        /* 显示的内容 */
        const modelDetailNames = dlModels.map(model => {
            return (
                <Option value={model.id}>
                    {model.modelDetailName}
                </Option>
            );
        });
        const fileOptions = files.map(file => {
            return (
                <Option value={file.fileId}>
                    {file.fileName}
                </Option>
            );
        });

        const tableData = nowArguments;
        return (
            <div className="form_div_layout">
                <h2 className="form_title">添加模型</h2>
                <Form onSubmit={this.handleSubmit}  style={{marginTop:"50px", marginLeft:"20%"}}>
                    <FormItem {...formItemLayout} label="模型名称: ">
                        {getFieldDecorator('modelName', modelNameConfig)(
                            <Input placeholder="请输入新的模型名称" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选择训练文件: ">
                        {getFieldDecorator('fileId', fileConfig)(
                            <Select placeholder="具体模型" onChange={this.getFile}>
                                {fileOptions}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选择具体模型: ">
                        {getFieldDecorator('modelDetailId', modelDetailNameConfig)(
                            <Select placeholder="具体模型" onChange={this.getModelInfos}>
                                {modelDetailNames}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="具体模型介绍: ">
                        {getFieldDecorator('modelDes')(
                            <span>
                                {model===undefined?"":model.modelDetailDes}
                            </span>
                        )}
                    </FormItem>
                    <FormItem {...formTableLayout} label="模型参数: ">
                        {getFieldDecorator('modelArguments')(
                            <ModelArgumentsTable dataSource={tableData} addModelArguments={this.addModelArguments}
                                                 modelId = {dlModelId}
                                                 models={dlModels}
                                                 modelArguments={tableData}
                                                 update_edit_true={this.props.update_args}
                                                 update_arg_value={this.props.update_args}
                            />
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 12, offset: 3 }}>
                        <Button type="primary" htmlType="submit">保存内容</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }

}
const mapStateToProps = state=>({
    addDLModelManage:state.addDLModelManage,
});

const mapDispatchToProps = dispatch =>({
    get_dl_models:bindActionCreators(get_dl_models,dispatch),
    get_dl_files:bindActionCreators(get_dl_files,dispatch),
    change_file:bindActionCreators(change_file,dispatch),
    change_model:bindActionCreators(change_model,dispatch),
    update_args:bindActionCreators(update_args,dispatch),
});

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(AddDLModel))
