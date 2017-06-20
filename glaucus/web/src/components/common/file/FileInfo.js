import React from 'react'
import {connect} from 'react-redux'
import {Table, Button, Icon, Popconfirm, message, Input,Modal,Transfer,Select} from 'antd'
import * as _ from "underscore";
import '../../../resources/FileInfo.css'
import ReactEcharts from 'echarts-for-react';
/**
 * Created by LXY on 2017/3/10.
 */

const conOrDis = {
    1 : "连续值",
    0 : "离散值",
    2 : "时间"
}

Array.prototype.contains = function (element) {

    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
    return false;
}

class EditableCell  extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.check = this.check.bind(this);
        this.edit = this.edit.bind(this);
    }

    handleChange = (e) => {
        const value = e.target.value;
        this.props.onChange(value);
    }
    check = () => {
        this.props.saveChange(this.props.value);
    }
    edit = () => {
        this.props.editCell();
    }
    render() {
        let { value, editable } = this.props;
        return (<div className="editable-cell">
            {
                editable ?
                    <div className="editable-cell-input-wrapper">
                        <Input
                            value={value}
                            onChange={this.handleChange}
                            onPressEnter={this.check}
                        />
                        <Icon
                            type="check"
                            className="editable-cell-icon-check"
                            onClick={this.check}
                        />
                    </div>
                    :
                    <div className="editable-cell-text-wrapper">
                        {value || ' '}
                        <Icon
                            type="edit"
                            className="editable-cell-icon"
                            onClick={this.edit}
                        />
                    </div>
            }
        </div>);
    }
}


class EditableTable extends React.Component{
    constructor(props){
        super(props);
        this.onCellChange = this.onCellChange.bind(this);
        this.editCell = this.editCell.bind(this);
        this.saveChange = this.saveChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onCellChange = (index, key) => { //更改数据时
        const newIndex = (this.props.maxCell)*(this.props.currentPage-1)+index;
        return (value) => {
            const dataSource = this.props.dataSource;
            dataSource[newIndex][key] = value;
            if(key==='aliasName')
                dataSource[newIndex]['aliasNameEditable'] = true;
            else
                dataSource[newIndex]['fieldDesEditable'] = true;
            this.props.update_header_info(dataSource);
        }
    }
    editCell=(index,key)=>{ //点击编辑按钮时
        const newIndex = (this.props.maxCell)*(this.props.currentPage-1)+index;
        return()=>{
            const dataSource = this.props.dataSource;
            if(key==='aliasName')
                dataSource[newIndex]['aliasNameEditable'] = true;
            else
                dataSource[newIndex]['fieldDesEditable'] = true;
            this.props.update_header_info(dataSource);
        }
    }

    saveChange=(index,key)=>{ //点击确认关闭编辑
        let newIndex = (this.props.maxCell)*(this.props.currentPage-1)+index;
        let headersNeedUpdate = this.props.headersNeedUpdate; //当前被修改过的header
        return(value)=>{
            let dataSource = this.props.dataSource;
            dataSource[newIndex][key] = value;
            if(key==='aliasName')
                dataSource[newIndex]['aliasNameEditable'] = false;
            else
                dataSource[newIndex]['fieldDesEditable'] = false;

            // let id = dataSource[newIndex]['id']; //当前的headerId
            let id = newIndex;
            if(!headersNeedUpdate.contains(id))
                headersNeedUpdate.push(id);
            // this.props.update_header_info(dataSource);
            this.props.get_header_id(dataSource,headersNeedUpdate);
        }
    }

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.props.get_pagination(pagination);
    }

    render(){
        let dataSource = this.props.dataSource;
        let myDataSource = dataSource;
        myDataSource = myDataSource.map(field=>{
            if ( field.valueInfo !== null && (field.valueInfo instanceof Array))
                field.valueInfo = (field.conOrDis === 0 ? field.valueInfo.toString() : field.valueInfo[0] + " ~ " + field.valueInfo[1])
            return field
        });
        const columns=[{
            title: '字段名',
            dataIndex: 'fieldName',
            key: 'fieldName',
            width:'15%'
        }, {
            title: '别名',
            dataIndex: 'aliasName',
            key: 'aliasName',
            width: '15%',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index,'aliasName')}
                    editable = {record.aliasNameEditable}
                    editCell={this.editCell(index,'aliasName')}
                    saveChange={this.saveChange(index,'aliasName')}
                />
            ),
        }, {
            title: '描述',
            dataIndex: 'fieldDes',
            key: 'fieldDes',
            width:'20%',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index,'fieldDes')}
                    editable = {record.fieldDesEditable}
                    editCell={this.editCell(index,'fieldDes')}
                    saveChange={this.saveChange(index,'fieldDes')}
                />
            ),
        },{
            title: '取值类型',
            dataIndex: 'fieldType',
            key: 'fieldType',
            width: "10%",
        },{
            title: '分布类型',
            dataIndex: 'conOrDis',
            key: 'conOrDis',
            width: "10%",
            render: (text) => {
                return (<span>{conOrDis[text]}</span>)
            }
        }, {
            title: "空值率",
            dataIndex: "nullsRatio",
            key: "nullsRatio",
            width: "10%",
            render: (text) => {
                return <span>{text.toFixed(1)} %</span>
            }
        }, {
            title: '值域',
            dataIndex: 'valueInfo',
            key: 'valueInfo',
            width: "20%"
        }];
        return(<div>
            <Table bordered dataSource={myDataSource}  columns={columns}
                   onChange={this.handleChange}
            />
        </div>)
    }
}

class DataCountTable extends React.Component{       //数据统计的结果展示表
    render(){
        let columns=[{
            title: '字段名',
            key: 'fieldName',
            dataIndex: 'fieldName',
            width: "20%",
        },{
            title: '最大值',
            key: 'max',
            dataIndex: 'max',
            width: "20%",
        },{
            title: '平均值',
            key: 'mean',
            dataIndex: 'mean',
            width: "20%",
        },{
            title: '方差',
            key: 'stddev',
            dataIndex: 'stddev',
            width: "20%",
        },{
            title: '标准差',
            key: 'variance',
            dataIndex: 'variance',
            width: "20%",
        }];

        let dataSource=[];
        let featureList=this.props.featureList;
        for(let k of Object.keys(this.props.data)){
            let featureName=featureList.filter((item) => (item.id === k))[0].fieldName;
            dataSource.push({
                fieldName:featureName,
                max:this.props.data[k].max,
                mean:this.props.data[k].mean,
                stddev:this.props.data[k].stddev,
                variance:this.props.data[k].variance,
            });
        }
        return (
            <Table  columns={columns}  dataSource={dataSource}/>
        );
    };
}

class KurSkewTbale extends React.Component{     //变量的偏值和峰值统计结果

    render(){
        let columns=[{
            title: '字段名',
            key: 'fieldName',
            dataIndex: 'fieldName',
            width: "40%",
        },{
            title: '峰度',
            key: 'kurtosis',
            dataIndex: 'kurtosis',
            width: "30%",
        },{
            title: '偏度',
            key: 'skewness',
            dataIndex: 'skewness',
            width: "30%",
        }];

        let dataSource=[];
        let featureList=this.props.featureList;
        for(let k of Object.keys(this.props.data)){
            let featureName=featureList.filter((item) => (item.id === k))[0].fieldName;
            dataSource.push({
                fieldName:featureName,
                kurtosis: this.props.data[k].kurtosis,
                skewness:this.props.data[k].skewness,
            });
        }
        return (
            <Table  columns={columns}  dataSource={dataSource}/>
        );
    };
}

class FileInfo extends React.Component{

    constructor(props) {
        super(props);
        this.confirmDeleteFile = this.confirmDeleteFile.bind(this);
        this.analysisFile = this.analysisFile.bind(this);
        this.addConfig = this.addConfig.bind(this);
        this.save = this.save.bind(this);
        this.showModel = this.showModel.bind(this);
        this.handelOk = this.handelOk.bind(this);
        this.handelCancel = this.handelCancel.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.imeStamp2String = this.imeStamp2String.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handelCloseOk = this.handelCloseOk.bind(this);
        this.showResults = this.showResults.bind(this);
    }

    confirmDeleteFile() {
        // message.success('Click on Yes');
        this.props.deleteFile(this.props.fileId);
    }

    analysisFile() {
        if(this.props.fileId.length === 0) {
            message.error('请选择文件后再试') ;
        } else {
            this.props.update_ana_button(true,"正在分析",this.props.fileId);
            //const self = this;
            const callback = (rst) => {
                let rstBool = rst;
                let rstTxt = rst ? "分析完成" : "开始分析";
                this.props.update_ana_button(rstBool,rstTxt,this.props.fileId);
            }
            this.props.analysisFile(this.props.fileId, callback);
        }
    }

    addConfig() {
        this.props.fileId.length === 0 ?
            message.error('请选择文件后再试') : this.props.addConfig(this.props.fileId);
    }

    save(){ //保存对文件头信息所做的更改
        this.props.saveHeaders(this.props.headersNeedUpdate);
    }

    showModel(){ //显示对话框
        this.props.change_visible(true);
    }

    handelOk(){  //点击对话框确认时
        //当选择的是皮尔森相关性分析时只能选择两个字段
        if(this.props.selectFunction==="58f5b23e1017b32a8422bc7f")
            if(this.props.modalData.targetKeys.length!==2){
                message.error('只能选择两个字段进行分析！')
                return;
            }
        // this.props.change_visible(false);
        this.props.analysisFields();    //点击确认开始进行分析
    }

    handelCloseOk(){  //点击空白处关闭对话框
        this.props.change_visible(false);
        // this.props.analysisFields();
    }

    handelCancel(){  //点击对话框取消按钮时
        this.props.change_visible(false);
    }

    handleFieldChange(targetKeys){    //当选择字段发生变化时
        this.props.change_field_list(targetKeys);
    }


    handleChange(value) {   //当选择的函数发生变化时
        // console.log(`selected ${value}`);
        let functionDescription = this.props.anaFunctions.filter((item) => (item.id === value))[0].funcDes;
        this.props.select_function(value,functionDescription);
    }

    imeStamp2String (time){ //转化时间的格式
        let datetime = new Date();
        datetime.setTime(time);
        let year = datetime.getFullYear();
        let month = datetime.getMonth() + 1;
        let date = datetime.getDate();
        let hour = datetime.getHours();
        let minute = datetime.getMinutes();
        if(hour<10) hour="0"+hour;
        if(minute<10) minute="0"+minute;
        return year + "-" + month + "-" + date+" "+hour+":"+minute;
    }

    showResults(results,func){          //显示字段分析的结果
        let featureList=this.props.data;            //所有字段信息
        let targets=this.props.modalData.targetKeys;    //所选择需要进行分析的字段
        let divResult=[];
        if(func ==="58f5b23e1017b32a8422bc7d"){     //数据分布
            for(let i=0;i<targets.length;i++){          //结果的长度和result的长度一致
                let tmpRes1=results[targets[i]];
                let featureName=featureList.filter((item) => (item.id === targets[i]))[0].fieldName;
                let data1=[];
                let dataList1=[];
                let total=0;
                for(let k of Object.keys(tmpRes1)){
                    data1.push({
                        value: tmpRes1[k],
                        name:k
                    });
                    dataList1.push(k);
                    total+=tmpRes1[k];
                }
                if((1-total)>0){
                    dataList1.push("空值");
                    data1.push({
                        value: 1-total,
                        name:"空值",
                    });
                }
                let option={
                    title : {
                        text:featureName+"的数据分布",
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: dataList1
                    },
                    series : [
                        {
                            name: '数据分布',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:data1,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }

                divResult.push(<ReactEcharts
                    option={option}
                    style={{height: '350px', width: '100%'}}
                    className='react_for_echarts' />);
            }
            return divResult;

        }else if(func==="58f5b23e1017b32a8422bc7c"){    //散点图
            for(let i=0;i<targets.length;i++){          //结果的长度和result的长度一致
                let tmpRes1=results[targets[i]];
                let featureName=featureList.filter((item) => (item.id === targets[i]))[0].fieldName;
                let yMax=0;     //y轴方向上的最大值
                let dataList=[];
                for(let k of Object.keys(tmpRes1)){
                    dataList.push([parseFloat(k),tmpRes1[k]]);
                    if(yMax<tmpRes1[k])
                        yMax=tmpRes1[k];
                }
                let option = {
                    title: {
                        text: '大规模散点图'
                    },
                    tooltip : {
                        trigger: 'axis',
                        showDelay : 0,
                        axisPointer:{
                            show: true,
                            type : 'cross',
                            lineStyle: {
                                type : 'dashed',
                                width : 1
                            }
                        },
                        zlevel: 1
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataZoom : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    xAxis : [
                        {
                            type : 'value',
                            scale:true
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            scale:true
                        }
                    ],
                    series : [
                        {
                            name:'值',
                            type:'scatter',
                            large: true,
                            symbolSize: 3,
                            data:dataList
                        }
                    ]
                };

                divResult.push(<ReactEcharts
                    option={option}
                    style={{height: '350px', width: '100%'}}
                    className='react_for_echarts' />);
            }
            return divResult;
        }else if(func==="58f5b23e1017b32a8422bc7e"){    //数据统计
            return <DataCountTable data={results} featureList={featureList}/>
        }else if(func==="58f5b23e1017b32a8422bc7f"){    //皮尔森相关系数
            if( Object.keys(results).length!==0)
                return <div className="corr-result">
                    选择的两个变量的的皮尔森相关系数为：{results.Corr}
                </div>;
            else
                return null;
        }else if(func==="58f5b23e1017b32a8422bc80"){    //偏度-峰度
            return <KurSkewTbale data={results} featureList={featureList}/>
        }
    }


    render(){
        let {fileName,data,fileId,createTime,fileInfo,analysedTxt,modalData,anaFunctions,selectFunction,functionDescription}=this.props;
        if(fileId=="image_train_x"||fileId==="image_train_y"||fileId==="image_test_x"||fileId==="image_test_y") {
            let info="";
            if(fileId=="image_train_x"){
                info="28*28*60000"
            }else if(fileId==="image_train_y"){
                info="1*10*60000"
            }else if(fileId==="image_test_x"){
                info="28*28*10000"
            }else if(fileId==="image_test_y"){
                info="1*10*10000";
            }
            return(
                <article className="article-page">
                    <div className="article-title">
                        文件大小：{info}
                    </div>
                </article>
            );
        }
        createTime = createTime !== null ? this.imeStamp2String(createTime) : "未知时间";
        let fileTotalNum = _.isEmpty(fileInfo) ? "" : "总行数: " + fileInfo.totalRows + "行";
        let deleteConfirm = "删除这个文件会包括删除这个文件下所有的配置和模型,确认删除这个文件吗?";
        let disabled = fileId===""?true:false;
        let num = (modalData.targetKeys).length;
        let btnText = num===0?"选择字段":("已选择"+num+"个字段");
        let anaAble = num===0?true:false;
        let modelBtnTxt = "";   //对话框确认按钮显示的文本
        let selectedInfo = anaFunctions.filter((item) => (item.id === selectFunction))[0]; //获取选择的函数的信息
        let newData = data;
        if(selectFunction===""){
            modelBtnTxt = "请选择分析方法";
            anaAble = true;
        }else{      //所选的function不为空则需要对可选择的字段进行过滤
            let fieldType=selectedInfo.flagOfType;//0--String, 1--Double or int, 2--all
            let conOrDis = selectedInfo.flagOfConOrDis;//0--con, 1--dis, 2--all
            //获取的字段信息里面 fieldType：string int double;conOrDis: 0-dis离散 1-con连续
            // newData = newData.filter((item) => ((item.conOrDis === conOrDis)&&(item.fieldType === fieldType)));
            if(fieldType===2&&conOrDis===2){
                newData=newData;
            }else if(fieldType===0&&conOrDis===0){
                newData=newData.filter((item) => ((item.conOrDis === 1)&&(item.fieldType === "string")));
            } else if(fieldType===0&&conOrDis===1){
                newData=newData.filter((item) => ((item.conOrDis === 0)&&(item.fieldType === "string")));
            }else if(fieldType===0&&conOrDis===2){
                newData=newData.filter((item) => ((item.fieldType === "string")));
            }else if(fieldType===1&&conOrDis===0){
                newData=newData.filter((item) => ((item.conOrDis === 1)&&((item.fieldType === "double")||(item.fieldType === "int"))));
            }else if(fieldType===1&&conOrDis===1){
                newData=newData.filter((item) => ((item.conOrDis === 0)&&((item.fieldType === "double")||(item.fieldType === "int"))));
            }else if(fieldType===1&&conOrDis===2){
                newData=newData.filter((item) => (((item.fieldType === "double")||(item.fieldType === "int"))));
            }else if(fieldType===2&&conOrDis===0){
                newData=newData.filter((item) => ((item.conOrDis === 1)));
            }else if(fieldType===2&&conOrDis===1){
                newData=newData.filter((item) => ((item.conOrDis === 0)));
            }
        }
        newData = Object.keys(newData).map(id => { //用于在modal上展示字段信息
            return {
                key:newData[id].id,
                fieldName:newData[id].fieldName
            }
        });
        modelBtnTxt =  num===0?"请选择字段":"开始分析";

        let selectFunctionOptions = anaFunctions.map(functions => {
            return (
                <Option value={functions.id}>
                    {functions.funcName}
                </Option>
            );
        })

        let description = selectFunction===""?"还未选择方法":functionDescription;

        let analyseResult = modalData.anaResult;  //分析结果
        let ResultDiv=[];
        if((Object.keys(analyseResult).length===num && Object.keys(analyseResult).length>0) || (selectFunction==="58f5b23e1017b32a8422bc7f"))
            ResultDiv = this.showResults(analyseResult,selectFunction);     //分析结果展示

        return (
            <article className="article-page">
                <div className="article-title">
                    <h1 style={{width:"20%"}}>{fileName} 表</h1>
                    <div className="button-group">
                        <Button className="button-config"
                                onClick={this.analysisFile}
                                disabled={this.props.analysed}><Icon type="area-chart" />{analysedTxt}</Button>
                        <Button type="dashed" className="button-config" disabled={disabled} onClick={this.addConfig}><Icon type="edit"/>增加配置</Button>
                        <Popconfirm placement="bottom"
                                    title={deleteConfirm}
                                    onConfirm={this.confirmDeleteFile}
                                    okText="确认"
                                    cancelText="取消">
                            <Button type="primary" className="button-delete" disabled={disabled}>删除文件<Icon type="delete" /></Button>
                        </Popconfirm>
                    </div>
                </div>
                <p className="create-time">{createTime} 创建</p>
                <div className="file-table-div">
                    <div className="table-title">
                        <h3 style={{width:"20%"}}>特征字段</h3>
                        <div className="button_save">
                            <Button  className="button-config"  onClick={this.showModel} ><Icon type="select" />{btnText}</Button>
                            <Button  onClick={this.save} ><Icon type="save" />保存</Button>
                        </div>
                    </div>
                    <span>{fileTotalNum}</span>
                    <div className="file-edit-table">
                        <EditableTable dataSource={data}
                                       update_header_info={this.props.update_header_info}
                                       get_pagination={this.props.get_pagination}
                                       maxCell={this.props.maxCell}
                                       currentPage={this.props.currentPage}
                                       headersNeedUpdate={this.props.headersNeedUpdate}
                                       get_header_id={this.props.get_header_id}
                        />
                    </div>
                </div>
                <Modal
                    visible={modalData.visible}
                    title="选择字段"
                    width="630"
                    onOk={this.handelCloseOk}
                    onCancel={this.handelCancel}
                    footer={[
                         <Button key="submit" type="primary" size="large" disabled={anaAble} loading={modalData.confirmLoading} onClick={this.handelOk}>
                             {modelBtnTxt}
                        </Button>,
                        <Button key="back" size="large" onClick={this.handelCancel}>取消</Button>,
                    ]}
                >
                    统计分析：<Select className="select"
                                 showSearch
                                 style={{ width: 300}}
                                 placeholder="选择分析方法"
                                 optionFilterProp="children"
                                 onChange={this.handleChange}
                                 filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {selectFunctionOptions}
                </Select>
                    <div className="select-des">
                        所选方法简介：{description}
                    </div>
                    <div className="select-field">
                        可选择的字段：
                    </div>
                    <Transfer
                        dataSource={newData}
                        showSearch
                        listStyle={{
                            width: 250,
                            height: 300,
                        }}
                        operations={['添加字段', '删除字段']}
                        targetKeys={modalData.targetKeys}
                        onChange={this.handleFieldChange}
                        render={item => item.fieldName}
                    />
                    {ResultDiv}
                </Modal>
            </article>
        );
    }
}

export default FileInfo;