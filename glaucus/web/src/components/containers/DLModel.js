import React from 'react'
import DLModelList from '../common/deepLearning/DLModelList'
import DLModelInfo from '../common/deepLearning/DLModelInfo'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {get_dl_all,get_the_model,change_visible,change_dl_model_page,change_select_file} from '../../redux/actions/DLModelAction'
import {changePage} from '../../redux/actions/AppHeaderActions'
import '../../styles/Model.css'
import {Button,message,Row,Col,notification} from 'antd'
import Get from '../../utils/Get'
import DLGet from '../../utils/DLGet'
import MyNotification from '../../utils/MyNotification'
/**
 * Created by LXY on 2017/6/7.
 */
class DLModel extends React.Component{
    constructor(props){
       super(props);
       this.trainModel=this.trainModel.bind(this);
        this.deleteModel = this.deleteModel.bind(this);
    }
    componentWillMount(){
    }

    componentDidMount(){
        this.props.changePage("deepLearning");
        this.props.get_dl_all(this.props.userId);
    }

    deleteModel(modelInfo){
        let modelId = modelInfo.modelId;
        let modelName = modelInfo.modelName;
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

    trainModel(modelId){       //训练模型
        DLGet("/api/model/dl/train?modelId=" + modelId).then(res => {
            console.log("addModel: " + res);
            if (res.status !==200) {
                if (res['data']) {
                    //3. train the Model
                    MyNotification('success',this.props.dLModelManage.modelInfo.modelName,"模型训练成功");
                } else {
                    MyNotification('error',this.props.dLModelManage.modelInfo.modelName,"模型训练失败，请重试");
                }
            } else {
                message.error("服务器出错，请重试");
            }
        })
    }

    render(){
        let {models,modelInfo,modelId,selectedFile,openKeys,currentModelPage,modalVisible,fileName} = this.props.dLModelManage;
        return(
            <div className="model-page">
                <div className="sub-menu">
                    <DLModelList models={models}
                                 modelId={modelId}
                                 selectedFile={selectedFile}
                                 openKeys={openKeys}
                                 currentModelPage={currentModelPage}
                                 get_the_model={this.props.get_the_model}
                                 change_dl_model_page={this.props.change_dl_model_page}
                                 change_select_file={this.props.change_select_file}
                    />
                </div>
                <div className="menu-detail">
                    <DLModelInfo modelInfo={modelInfo}
                                 modalVisible={modalVisible}
                                 trainModel={this.trainModel}
                                 deleteModel={this.deleteModel}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state=>({
    dLModelManage:state.dLModelManage
});

const mapDispatchToProps = dispatch =>({
    get_dl_all:bindActionCreators(get_dl_all,dispatch),
    get_the_model:bindActionCreators(get_the_model,dispatch),
    change_visible:bindActionCreators(change_visible,dispatch),
    change_dl_model_page:bindActionCreators(change_dl_model_page,dispatch),
    change_select_file:bindActionCreators(change_select_file,dispatch),
    changePage:bindActionCreators(changePage,dispatch),
});

export default connect(mapStateToProps,mapDispatchToProps)(DLModel)