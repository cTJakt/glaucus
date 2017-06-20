import React from 'react'
import { Select, Form, Input, Table, Tooltip, Button, Icon, InputNumber,message} from 'antd';
import * as _ from "underscore";
import "../../../styles/ModelSelect.css"
/**
 * Created by LXY on 2017/3/19.
 */
const FormItem = Form.Item;
const Option = Select.Option;
const modelTypeDic = {
    "classification": "分类模型",
    "cluster"    : "聚类模型",
    "regression":"回归模型",
    "dl":"深度学习"
}

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.check = this.check.bind(this);
        this.edit = this.edit.bind(this);
    }

    handleChange = (value) => {
        this.props.update_arg_value(value);
    }
    check = () => {
        this.props.onChange(this.props.value);
    }
    edit = () => {
        this.props.update_edit_true(); //将所选单元格设置为可编辑
    }
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

class ModelSelect extends React.Component {
    constructor(props) {
        super(props);
        this.getModels = this.getModels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getModelInfos = this.getModelInfos.bind(this);
        this.addModelArguments = this.addModelArguments.bind(this);
    }

    componentDidMount() {
        this.getModels();
    }
    getModels() {
        this.props.get_model(this.props.modelTypeName); //获取该模型分类下的所有模型及其参数
    }
    getModelInfos(modelId) {
        console.log("choose modelId = " + modelId);
        this.props.update_when_change(this.props.models,modelId);
    }
    addModelArguments(values) {
        this.props.add_model_args(values);
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log(e);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                values["modelDetailName"] = this.props.modelDetailName;
                values["modelArguments"] = this.props.modelArguments;
                // this.props.setModelInfos(values);
                this.props.update_model(values);
                message.success('模型信息保存成功!');
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
            wrapperCol: { span: 21},
        };
        //form rules and initial values
        const modelNameConfig = {
            rules: [{ required: true, message: '请输入配置名!' }],
        };
        const modelDetailNameConfig = {
            rules: [{ required: true, message: '请选择具体模型!' }],
        };
        /* 显示的内容 */
        const modelTypeName = modelTypeDic[this.props.modelTypeName];
        const modelDetailNames = this.props.models.map(model => {
            return (
                <Option value={model.id}>
                    {model.modelDetailName}
                </Option>
            );
        })
        const tableData = this.props.modelArguments
        return (
            <div>
                <Form onSubmit={this.handleSubmit}  style={{marginTop:"50px"}}>
                    <FormItem {...formItemLayout} label="模型类型: ">
                        {getFieldDecorator('modelType')(
                            <Tooltip title={this.props.modelDes} placement="right">
                                <a>{modelTypeName}</a>
                            </Tooltip>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="模型名称: ">
                        {getFieldDecorator('modelName', modelNameConfig)(
                            <Input placeholder="请输入新的模型名称" />
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
                                {this.props.modelDetailDes}
                            </span>
                        )}
                    </FormItem>
                    <FormItem {...formTableLayout} label="模型参数: ">
                        {getFieldDecorator('modelArguments')(
                            <ModelArgumentsTable dataSource={tableData} addModelArguments={this.addModelArguments}
                                                 modelId = {this.props.modelId}
                                                 models={this.props.models}
                                                 modelArguments={tableData}
                                                 update_edit_true={this.props.update_edit_true}
                                                 update_arg_value={this.props.update_arg_value}
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

ModelSelect = Form.create()(ModelSelect)
export default ModelSelect;
