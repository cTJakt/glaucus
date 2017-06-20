import React from 'react'
import '../../styles/Model.css'
import ListModels from '../common/model/ListModel'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {get_model,change_model,change_config,change_model_page,change_modal_state,get_file_info,change_upload,begin_forecast,change_forecast_state,update_result} from '../../redux/actions/Model'
import ModelInfo from '../common/model/ModelInfo'
import Get from '../../utils/Get'
import {notification,message} from 'antd'
import {changePage} from '../../redux/actions/AppHeaderActions'
import MyNotification from '../../utils/MyNotification'
/**
 * Created by LXY on 2017/3/18.
 */
class Model extends React.Component {
    constructor(props) {
        super(props);
        this.deleteModel = this.deleteModel.bind(this);
        this.trainModel = this.trainModel.bind(this);
    }

    componentDidMount() {
        this.props.changePage("model");
        this.props.get_model(this.props.userId);
    }

    deleteModel(modelId){ //删除模型
        let modelName =  (this.props.modelManage.models.filter((item) => (item.modelId === modelId))[0]).modelName;
        Get("/api/model/delete?modelId="+modelId).then(res => {
            if(res!=null) {
                if (res['data'] === true) { //若删除成功则重新加载界面
                    notification["success"]({
                        message: modelName,
                        description: "模型删除成功",
                    })
                    this.props.get_model(this.props.userId);
                } else {
                    notification["error"]({
                        message: modelName,
                        description: "模型删除失败",
                    })
                }
            }else {
                message.error("服务器出错，请重试");
            }
        });
    }

    trainModel(modelId){ //训练选择的模型
        let modelName =  (this.props.modelManage.models.filter((item) => (item.modelId === modelId))[0]).modelName;
        notification["info"]({
            message: modelName,
            description: '模型开始训练',
        });
        Get("/api/model/train?modelId="+modelId).then(res => {
            if (res != null) {
                if (res['data'] === true) { //若删除成功则重新加载界面
                    MyNotification('success', modelName, "模型训练成功");
                    this.props.get_model(this.props.userId);
                } else {
                    MyNotification('error', modelName, "模型训练失败");
                }
            }else {
                message.error("服务器出错，请重试");
            }
        });
    }

    render() {
        // let models = [];
        let {models,modelId,configId,openKeys,currentModelPage,modalVisible,uploadLoading,fileName,fileInfo,fileId,btnSpin,forecastRes} = this.props.modelManage;
        let change_model = this.props.change_model;
        let change_config = this.props.change_config;
        console.log("Get full model: " + models);
        let model = models!==undefined? models.filter((item) => (item.modelId === modelId))[0]:undefined;
        let modelName="",trainedStatus=-1,modelDetailName="",modelDetailDes="",trainedRsl="",argument="",modelTypeName="";
        if(model!==undefined) {
            modelName=model.modelName,trainedStatus=model.trainedStatus,modelDetailName=model.modelDetailName,
                modelDetailDes=model.modelDetailDes,trainedRsl=model.resOfModel,argument=model.arguments,modelTypeName=model.modelTypeName;
        }
        return (
            <div className="model-page">
                <div className="sub-menu">
                    <ListModels models={models}
                                change_model={change_model}
                                openKeys={openKeys}
                                change_config={change_config}
                                modelId = {modelId}
                                currentModelPage={currentModelPage}
                                change_model_page={this.props.change_model_page}
                                />
                </div>
                <div className="menu-detail">
                    <ModelInfo modelId={modelId}
                               trainedStatus={trainedStatus}
                               modelName={modelName}
                               modelTypeName={modelTypeName}
                               modelDetailName={modelDetailName}
                               modelDetailDes={modelDetailDes}
                               arguments = {argument}
                               deleteModel={this.deleteModel}
                               trainModel={this.trainModel}
                               modalVisible={modalVisible}
                               change_modal_state={this.props.change_modal_state}
                               userId={this.props.userId}
                               get_file_info={this.props.get_file_info}
                               change_upload={this.props.change_upload}
                               begin_forecast={this.props.begin_forecast}
                               change_forecast_state={this.props.change_forecast_state}
                               update_result={this.props.update_result}
                               uploadLoading={uploadLoading}
                               fileName={fileName}
                               fileInfo={fileInfo}
                               btnSpin={btnSpin}
                               fileId={fileId}
                               forecastRes={forecastRes}
                               trainedRsl={trainedRsl}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state=>({
    modelManage:state.modelManage
});

const mapDispatchToProps = dispatch =>({
    get_model:bindActionCreators(get_model,dispatch),
    change_model:bindActionCreators(change_model,dispatch),
    change_config:bindActionCreators(change_config,dispatch),
    changePage:bindActionCreators(changePage,dispatch),
    change_model_page:bindActionCreators(change_model_page,dispatch),
    change_modal_state:bindActionCreators(change_modal_state,dispatch),
    change_upload:bindActionCreators(change_upload,dispatch),
    get_file_info:bindActionCreators(get_file_info,dispatch),
    begin_forecast:bindActionCreators(begin_forecast,dispatch),
    change_forecast_state:bindActionCreators(change_forecast_state,dispatch),
    update_result:bindActionCreators(update_result,dispatch),
});

export default connect(mapStateToProps,mapDispatchToProps)(Model)