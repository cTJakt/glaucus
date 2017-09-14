import React from 'react';
import {Table, Button, Icon, Tooltip,Popconfirm,Modal,message} from 'antd';
import ReactEcharts from 'echarts-for-react';
/**
 * Created by LXY on 2017/6/18.
 */
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

class DLModelInfo extends React.Component {
    constructor(props) {
        super(props);
        this.deleteModel = this.deleteModel.bind(this);
        this.enterLoading=this.enterLoading.bind(this);
        this.useModel=this.useModel.bind(this);
        this.showTrainResult=this.showTrainResult.bind(this);
    }

    enterLoading() {    //当显示的为未训练时，点击该按钮进行训练,然后重新加载
        const modelId = this.props.modelInfo.modelId;
        //do things with modelId
        this.props.trainModel(modelId);
    }

    deleteModel(){  //删除model
        this.props.deleteModel(this.props.modelInfo);
    }

    useModel(){     //使用模型

    }

    showTrainResult(trainArrays){      //显示训练结果,epoch的值,return 一个div即可
        let divResult=[];   //结果
        let str=trainArrays.slice(1,trainArrays.length-1);
        let arr=str.split(",");
        let xData=[];
        for(let i=0;i<arr.length;i++){
            xData.push(i+1);
        }
        let option = {
            title: {
                text: '训练结果',
                left: 'center'
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0]
                }
            ],
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
            xAxis: {
                type: 'category',
                name: 'x',
                splitLine: {show: false},
                data: xData
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'log',
                name: 'y'
            },
            series: [
                {
                    name: '准确率',
                    type: 'line',
                    data: arr
                }
            ]
        };
        divResult.push(<ReactEcharts
            option={option}
            style={{height: '350px', width: '100%'}}
            className='react_for_echarts' />);
        return divResult;
    }

    render(){
        let {modelInfo,modalVisible,} = this.props;
        // if(modelInfo==="") return;
        let flag=-1;
        let trainTime="未训练完成";
        let trainArrays=[];
        if(modelInfo!==""){
            if(modelInfo.trained && modelInfo.resOfModel!==null){
                flag = 1;
            }else if(modelInfo.trained && modelInfo.resOfModel===null){
                flag = 0;
            }else{
                flag = -1;
            }
            if(modelInfo.resOfModel!==null){
                trainTime=modelInfo.resOfModel["CostTime"]+"s";
                trainArrays=modelInfo.resOfModel["Accuracy"];
            }
        }
        let trainedStatus=flag;
        const buttonType = (trainedStatus>-1) ? "dashed" : "primary";
        const buttonIcon = (trainedStatus>-1) ? "check-circle-o" : "close-circle-o";
        const modelDetailName = modelInfo===""?"":modelInfo.modelDetailName;
        const modelDetailDes =modelInfo===""?"":modelInfo.modelDetailDes;
        const argument = modelInfo===""?[]:modelInfo.arguments;
        let buttonEnable = false;
        if(trainedStatus === 1){
            buttonEnable = true;
        }else if(trainedStatus === -1)
            buttonEnable = false;
        else if(trainedStatus === 0)
            buttonEnable = true;
        if ((modelInfo===""?"":modelInfo.modelId)==="") //modelId为空，即加载时无数据时
            buttonEnable=true;
        let buttonText = "未训练";
        if(trainedStatus === 1){
            buttonText = "已训练";
        }else if(trainedStatus === -1)
            buttonText = "未训练";
        else if(trainedStatus === 0)
            buttonText = "训练中";
        let deleteConfirm="确定删除模型？";
        let trainInfo=[];
        if(trainedStatus===-1){
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
            </Popconfirm>;
        }else{
            trainInfo=<Button type={buttonType}
                              icon={buttonIcon}
                              disabled={buttonEnable}>
                {buttonText}
            </Button>
        }
        let modelBtn=[];
        if(trainedStatus === 1){         //使用模型的按钮
            modelBtn =  <Button type="primary" className="button-modal"  onClick={this.useModel}><Icon type="star"/>使用模型</Button>;
        }

        let trainResult=[];     //显示训练结果
        if(!(trainArrays instanceof Array)){      //有训练结果则画出一个折线图
            trainResult=this.showTrainResult(trainArrays);
        }
        return(
            <article className="article-page">
                <div className="article-title">
                    <h1 style={{width:"20%"}}>{modelInfo===""?"":modelInfo.modelName}</h1>
                    <div className="button-box">
                        {modelBtn}
                        {trainInfo}
                        <Popconfirm placement="bottom"
                                    title={deleteConfirm}
                                    onConfirm={this.deleteModel}
                                    okText="确认"
                                    cancelText="取消">
                            <Button type="primary" className="button-delete"><Icon type="delete" />删除模型</Button>
                        </Popconfirm>
                    </div>
                </div>
                {/*<p className="subtitle">具体模型类别：*/}
                    {/*<Tooltip title={modelDetailDes} placement="right">*/}
                        {/*<a>{modelDetailName}</a>*/}
                    {/*</Tooltip>*/}
                {/*</p>*/}
                <p className="subtitle">训练时间：
                        <a>{trainTime}</a>
                </p>
                <h3 style={{marginTop:"20px"}}>模型参数</h3>
                <div className="table-div">
                    <ArgTable arguments={argument}/>
                </div>
                {trainResult}
            </article>
        );
    }
}

export default DLModelInfo;