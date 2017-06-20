import React from 'react';
import {Table, Button, Icon, Tooltip,Popconfirm,Modal,message} from 'antd';
import '../../../styles/ModelInfo.css'
import FileUpload from './FileUpload'
/**
 * Created by LXY on 2017/3/18.
 */
class ModelDetailTable extends React.Component {
    render() {
        const columns =  [{
            title: '结果名',
            key: 'key',
            dataIndex: 'key',
            width: "50%",
        },{
            title: '结果值',
            key: 'value',
            dataIndex: 'value',
            width: "50%",
        }];

        let dataArray = new Array();
        if(this.props.trainedRsl!==null){
            for(let k of Object.keys(this.props.trainedRsl)){
                dataArray.push({
                    key: k,
                    value:this.props.trainedRsl[k]
                });
            }
        }

        // dataArray = [...dataMap];
        return (
            <Table  columns={columns}  dataSource={dataArray}/>
        );
    }

}

class ArgTable extends React.Component {
    render() {
        const columns = [{
            title: '参数名',
            key: 'key',
            dataIndex: 'key',
            width: "50%",
        },{
            title: '参数值',
            key: 'value',
            dataIndex: 'value',
            width: "50%",
        }];

        let dataArray = [];
        if(this.props.arguments!==null){
            for(let k of Object.keys(this.props.arguments)){
                dataArray.push({
                    key: k,
                    value:this.props.arguments[k]
                });
            }
        }
        return (
            <Table  columns={columns}  dataSource={dataArray}/>
        );
    }
}

class FileInfoTable extends React.Component{
    render() {
        let forecastRes=this.props.forecastRes;
        let itemWidth=150;
        let data=this.props.fileInfo;
        let columns=[]; //表头信息
        if(data.length>0){      //取出表头信息
            let info= data[0];
            for(let header in info){
                let temp={
                    title: header,
                    key: header,
                    dataIndex: header,
                    width:itemWidth
                };
                columns.push(temp);
            }
        }
        let width=(columns.length)*itemWidth;
        return (
            <Table  columns={columns} dataSource={data}  scroll={{ x: width, y: 240 }}/>
        );
    }
}

class ForecastResultTable extends React.Component{
    render() {
        let forecastRes=this.props.forecastRes;
        let itemWidth=200;
        let columns=[]; //表头信息
        if(forecastRes===undefined){
            message.error("预测失败！");
            return(<div></div>);
        }
        if(forecastRes.length>0){      //取出表头信息
            let info= forecastRes[0];
            for(let header in info){
                let temp={
                    title: "Result of "+header,
                    key: header,
                    dataIndex: header,
                    width:itemWidth,
                };
                columns.push(temp);
            }
        }
        let width=(columns.length)*itemWidth;
        return (
            <Table  columns={columns} dataSource={forecastRes}  scroll={{ x: width, y: 240 }}/>
        );
    }
}


class ModelInfo extends React.Component {
    constructor(props) {
        super(props);
        this.enterLoading = this.enterLoading.bind(this);
        this.deleteModel = this.deleteModel.bind(this);
        this.useModel=this.useModel.bind(this);
        this.handelCloseOk=this.handelCloseOk.bind(this);
        this.handelCancel=this.handelCancel.bind(this);
        this.handelOk=this.handelOk.bind(this);
    }

    deleteModel(){
        this.props.deleteModel(this.props.modelId);
    }

    enterLoading() {    //当显示的为未训练时，点击该按钮进行训练,然后重新加载
        const modelId = this.props.modelId;
        //do things with modelId
        this.props.trainModel(modelId);
    }

    useModel(){     //点击弹出弹框
        this.props.change_modal_state(true);
    }

    handelCloseOk(){        //点击弹框外关闭
        if(this.props.forecastRes===undefined)      //训练失败的时候结果重置
            this.props.update_result([]);
        this.props.change_modal_state(false);
    }

    handelCancel(){     //点击取消按钮
        if(this.props.forecastRes===undefined)      //训练失败的时候结果重置
            this.props.update_result([]);
        this.props.change_modal_state(false);
    }

    handelOk(){      //点击确认按钮
        this.props.change_forecast_state(true);     //按钮变成加载状态
        this.props.begin_forecast(this.props.fileId,this.props.modelId);
    }

    render() {
        let disabled = this.props.modelId===""?true:false;
        const modelName = this.props.modelName;
        const buttonType = (this.props.trainedStatus>-1) ? "dashed" : "primary";
        const buttonIcon = (this.props.trainedStatus>-1) ? "check-circle-o" : "close-circle-o";
        const modelDetailName = this.props.modelDetailName;
        const modelDetailDes = this.props.modelDetailDes;
        const trainedRsl = this.props.trainedRsl;
        const argument = this.props.arguments;
        console.log("hehe:" + trainedRsl);
        let buttonEnable = false;
        if(this.props.trainedStatus === 1){
            buttonEnable = true;
        }else if(this.props.trainedStatus === -1)
            buttonEnable = false;
        else if(this.props.trainedStatus === 0)
            buttonEnable = true;
        if (this.props.modelId==="") //modelId为空，即加载时无数据时
            buttonEnable=true;
        let buttonText = "未训练";
        if(this.props.trainedStatus === 1){
            buttonText = "已训练";
        }else if(this.props.trainedStatus === -1)
            buttonText = "未训练";
        else if(this.props.trainedStatus === 0)
            buttonText = "训练中";
        const deleteConfirm = "确定删除这个模型吗?";

        let trainInfo=[];
        if(this.props.trainedStatus===-1){
            trainInfo= <Popconfirm placement="bottom"
                                   title="确定开始训练模型？"
                                   onConfirm={this.enterLoading}
                                   okText="确认"
                                   cancelText="取消">
                <Button type={buttonType}
                        icon={buttonIcon}
                        disabled={buttonEnable}>
                    {buttonText}
                </Button>
            </Popconfirm>
        }else{
            trainInfo=<Button type={buttonType}
                    icon={buttonIcon}
                    disabled={buttonEnable}>
                {buttonText}
            </Button>
        }
        let modelBtn=[];
        if(this.props.trainedStatus === 1){         //使用模型的按钮
            modelBtn =  <Button type="primary" className="button-modal"  onClick={this.useModel}><Icon type="star"/>使用模型</Button>;
        }
        let fileTableTitle=this.props.fileInfo.length===0?"表信息：":this.props.fileName+":";
        let beginBtnAble=this.props.fileInfo.length===0?true:false;     //没有可用信息的时候不可以预测

        return (
            <article className="article-page">
                <div className="article-title">
                    <h1 style={{width:"20%"}}>{modelName}</h1>
                    <div className="button-box">
                        {modelBtn}
                        {trainInfo}
                        <Popconfirm placement="bottom"
                                    title={deleteConfirm}
                                    onConfirm={this.deleteModel}
                                    okText="确认"
                                    cancelText="取消">
                            <Button type="primary" className="button-delete" disabled={disabled}><Icon type="delete" />删除模型</Button>
                        </Popconfirm>
                    </div>
                </div>
                <p className="subtitle">具体模型类别：
                    <Tooltip title={modelDetailDes} placement="right">
                        <a>{modelDetailName}</a>
                    </Tooltip>
                </p>
                <h3 style={{marginTop:"20px"}}>模型参数</h3>
                <div className="table-div">
                    {/*<p className="train-show-title"><Icon type="frown-o" />  */}
                    {/*{trainedRsl !== "" ? trainedRsl : "没有训练结果"}</p>*/}
                    <ArgTable arguments={argument}/>
                </div>

                <h3 style={{marginTop:"20px"}}>训练结果</h3>
                <div className="table-div">
                    {/*<p className="train-show-title"><Icon type="frown-o" />  */}
                    {/*{trainedRsl !== "" ? trainedRsl : "没有训练结果"}</p>*/}
                    <ModelDetailTable trainedRsl={trainedRsl} />
                </div>

                <Modal
                    visible={this.props.modalVisible}
                    title="使用模型"
                    width="630"
                    onOk={this.handelCloseOk}
                    onCancel={this.handelCancel}
                    footer={[
                        <Button key="submit" type="primary" size="large" onClick={this.handelOk} loading={this.props.btnSpin} disabled={beginBtnAble}>
                            开始运行
                        </Button>,
                        <Button key="back" size="large" onClick={this.handelCancel}>取消</Button>,
                    ]}
                >
                    <FileUpload userId={this.props.userId}
                                get_file_info={this.props.get_file_info}
                                change_upload={this.props.change_upload}
                                uploadLoading={this.props.uploadLoading}
                    />
                    <div className="file-table-name">{fileTableTitle}</div>
                    <FileInfoTable fileName={this.props.fileName}
                                   fileInfo={this.props.fileInfo}
                    />
                    <ForecastResultTable forecastRes={this.props.forecastRes}/>
                </Modal>

            </article>
        );
    }
}

export default ModelInfo;