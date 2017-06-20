import React from 'react';
import "../../styles/AddConfig.css"
import { Steps, Icon, message, notification,Spin } from 'antd';
import FeatureSelect from '../common/config/FeatureSelect'
import {get_features,get_files,file_select,update_config,update_model,feature_change,change_model_type,auto_feature,change_btn_state,change_feature_spin,select_method,
    change_step,update_when_change,add_model_args,update_model_info,get_models,update_edit_true,update_arg_value,do_init,change_select_way,select_field} from '../../redux/actions/AddConfigAction'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ModelSelect from '../common/config/ModelSelect'
import ConfigInfoConfirm from '../common/config/ConfigInfoConfirm'
import Post from '../../utils/Post'
import Get from '../../utils/Get'
import DLGet from '../../utils/DLGet'
import * as _ from "underscore";
import { hashHistory } from 'react-router';
import MyNotification from '../../utils/MyNotification'

/**
 * 增加一个配置界面
 * Created by LXY on 2017/3/19.
 */
const Step = Steps.Step;
let submitControl = false;
class AddConfig extends React.Component {
    constructor(props) {
        super(props);
        this.clickLeftStep = this.clickLeftStep.bind(this);
        this.clickRightStep = this.clickRightStep.bind(this);
        this.setConfigInfos = this.setConfigInfos.bind(this);
        this.setModelInfos = this.setModelInfos.bind(this);
        this.submitInfos = this.submitInfos.bind(this);
        this.submitConfigInfo = this.submitConfigInfo.bind(this);
        this.submitModelInfo = this.submitModelInfo.bind(this);
        this.trainTheModel = this.trainTheModel.bind(this);
    }
    componentWillMount(){
    }

    componentDidMount() {
        submitControl = false;
        if (this.props.configId !== null) { //直接进入第二步

            this.props.change_step(1);
            this.props.update_arg_value([]);
            let featureList= [];
            Object.keys(this.props.trainFeatureList).map(id => {
                featureList.push(this.props.trainFeatureList[id].id)
            });
            let value={
                fileId: this.props.fileId,
                modelTypeName: this.props.modelTypeName,
                confName: this.props.confName,
                featureList: featureList,
            };
            this.props.update_config(value,"");
            this.props.feature_change(featureList);
            // this.props.do_init();
        }else {
            this.props.change_step(0);
            this.props.do_init();
            if(!_.isUndefined(this.props.plus) && this.props.plus !== 'addConfig'){
                this.props.file_select(this.props.plus);
            }
        }
    }
    setModelInfos(value) {
        this.props.update_model(value);
        message.success('模型信息保存成功!');
    }

    setConfigInfos(values,features) {
        if(this.props.addConfigManage.modelType==='dl'){        //如果选择的是全部自动训练则传递参数全部训练
            let configName=values.confName;
            let modelName=values.modelName;
            let fieldId=this.props.addConfigManage.objectField; //训练目标字段
            let fileId=this.props.addConfigManage.fileId;   //选择的训练文件
            let trainFeatures=[];
            for(let i=0;i<features.length;i++){
                let key=features[i].key;
                if(key!==fieldId)       //将其他字段作为训练字段
                    trainFeatures.push(key);
            }
            trainFeatures.push(fieldId);        //最后一个是训练的目标字段
            const configInfo = {
                "fileInfoId" : this.props.addConfigManage.fileId,
                "userId" : this.props.userId,
                "modelTypeId" : this.props.modelTypeId,
                "confName" : configName,
                "fieldIds" :trainFeatures
            };
            Post("/api/config/add", JSON.stringify(configInfo)).then(res=>{     //添加配置
                if(res!==null){
                    let newConfigId=res['data'];        //添加的configId
                    const modelInfo = {
                        "fileId" : fileId,
                        "configId" : newConfigId,
                        "modelName" : modelName,
                        "modelTypeId" : this.props.addConfigManage.modelTypeId,
                        "arguments" : {}        //参数为0
                    };
                    // 2. add Model
                    Post("/api/model/add", JSON.stringify(modelInfo)).then(modelRes => {
                        if (modelRes !== null) {
                            //3. train the Model
                            notification["info"]({
                                message: modelName,
                                description: '开始训练',
                            });
                            let modelId=modelRes['data'];      //开始训练
                            DLGet("/api/automl?modelId=" + modelId+"&fieldId="+fieldId+"&fileId="+fileId).then(trainRes => {
                                if (trainRes !== null) {
                                    if (trainRes['data']) {
                                        //3. train the Model
                                        MyNotification('success', modelName, "模型训练成功");
                                        submitControl = false;
                                    } else {
                                        MyNotification('error', modelName, "模型训练失败，请重试");
                                    }
                                } else {
                                    message.error("服务器出错，请重试");
                                }
                            })
                        } else {
                            message.error("添加模型信息出错，请重试");
                            submitControl = false;
                        }
                    });

                }else{
                    message.error("添加配置信息出错，请重试！");
                }
            });
            this.props.get_all();   //返回配置主界面并重新获取配置信息
            hashHistory.push("/app/"+ this.props.userId +"/config"+"/default");
            return;
        }
        if(this.props.addConfigManage.targetKeys.length<2&&(this.props.addConfigManage.modelType==="classification")){ //当为分类时，选择的特征数必须大于2，即至少一个目标量和训练量
            message.error('请至少选择一个训练字段！');
            return;
        }
        if(this.props.fileId!=="imge")
            this.props.update_config(values,features);
        else
            this.props.update_config(values,["58f5804a98c83e1ac842f8ca"]);
        message.success('配置信息保存成功!');
    }
    trainTheModel(modelId) {
        //console.log("fielId: "+ this.props.addConfigManage.fileId)
        if(this.props.addConfigManage.fileId !=="image"){
            Get("/api/model/train?modelId=" + modelId).then(res => {
                console.log("addModel: " + res);
                if (res != null) {
                    if (res['data']) {
                        //3. train the Model
                        MyNotification('success',this.props.addConfigManage.modelName,"模型训练成功");
                        this.props.get_all(this.props.userId);
                        submitControl = false;
                    } else {
                        MyNotification('error',this.props.addConfigManage.modelName,"模型训练失败，请重试");
                    }
                } else {
                    message.error("服务器出错，请重试");
                }
            })
        }else {
            DLGet("/api/model/dl/train?modelId=" + modelId).then(res => {
                console.log("addModel: " + res);
                if (res !== null) {
                    if (res['data']) {
                        //3. train the Model
                        MyNotification('success', this.props.addConfigManage.modelName, "模型训练成功");
                        submitControl = false;
                    } else {
                        MyNotification('error', this.props.addConfigManage.modelName, "模型训练失败，请重试");
                    }
                } else {
                    message.error("服务器出错，请重试");
                }
            })
        }
    }

    submitConfigInfo() {    //提交添加的配置信息
        const configInfo = {
            "fileInfoId" : this.props.addConfigManage.fileId,
            "userId" : this.props.userId,
            "modelTypeId" : this.props.modelTypeId,
            "confName" : this.props.addConfigManage.confName,
            "fieldIds" : this.props.addConfigManage.fileId==="image"?["58f5804a98c83e1ac842f8ca"]:this.props.addConfigManage.targetKeys
        };
        return Post("/api/config/add", JSON.stringify(configInfo));
    }
    submitModelInfo(configId) {     //提交添加的模型信息
        const refreshAfterAddConfig = this.props.refreshAfterAddConfig;
        let argument = this.props.addConfigManage.modelArguments;

        const defaultModelArguments = argument.reduce((prev, cur) => {
            prev[cur.argName] = cur.argValue;
            return prev;
        }, {});
        const modelInfo = {
            "fileId" : this.props.addConfigManage.fileId,
            "configId" : configId,
            "modelName" : this.props.addConfigManage.modelName,
            "modelTypeId" : this.props.addConfigManage.modelTypeId,
            "arguments" : defaultModelArguments
        };
        // 2. add Model
        Post("/api/model/add", JSON.stringify(modelInfo)).then(res => {
            console.log(res);
            if (res != null) {
                //3. train the Model
                notification["info"]({
                    message: this.props.addConfigManage.modelName,
                    description: '开始训练',
                });
                this.trainTheModel(res['data']);

                refreshAfterAddConfig(this.props.addConfigManage.fileId,configId);
                // hashHistory.push("/app/"+ this.props.userId +"/config"+"/default")
            } else {
                message.error("添加模型信息出错，请重试");
                submitControl = false;
            }
        });
    }
    submitInfos() {
        if (this.props.configId !== null) {
            this.submitModelInfo(this.props.configId);
            return ;
        }
        //last step and need confirmation
        if (!submitControl) {
            submitControl = true;
            //1. add Config
            this.submitConfigInfo().then(res => {
                console.log(res);
                if (res !== null) {
                    this.submitModelInfo(res['data']);
                } else {
                    message.error("添加配置信息出错，请重试");
                    submitControl = false;
                }
            })
        } else {
            message.info("正在添加配置中，请等待")
        }
    }
    clickLeftStep() {
        this.props.change_step(this.props.addConfigManage.stepCurrent-1);
    }
    clickRightStep() {
        const stepCurrent = this.props.addConfigManage.stepCurrent + 1;
        if (this.props.addConfigManage.stepCurrent === 0) {
            //step 1
            if (this.props.addConfigManage.featureSelectDataReady === true) {
                this.props.change_step(stepCurrent);
            } else {
                message.error('请先保存所有配置信息，再选择模型.');
            }
        } else if (this.props.addConfigManage.stepCurrent === 1) {
            //step 2
            if (this.props.addConfigManage.modelSelectDataReady === true) {
                this.props.change_step(stepCurrent);
            } else {
                message.error('请先保存所有模型信息，再进行确认.');
            }
        }
    }
    render() {
        let {fileId,files,featureList,targetKeys,modelType,stepCurrent,modelTypeName,models,featureSpinLoading,methodId,featureResult,objectField,
            modelDetailName,modelArguments,modelDes,modelId,modelDetailDes,confName,modelName,trainFeatureList,featureSelectWay,objectFeature,btnLoading} = this.props.addConfigManage;
        if(modelTypeName==="" || modelTypeName===undefined){
            modelTypeName=this.props.modelTypeName;
        }
        const stepContent = [{
            title: '选择特征',
            content: <FeatureSelect userId={this.props.userId}
                                    setConfigInfos={this.setConfigInfos}
                                    fileInfoId={this.props.plus}
                                    get_files={this.props.get_files}
                                    get_features={this.props.get_features}
                                    file_select={this.props.file_select}
                                    feature_change={this.props.feature_change}
                                    change_model_type={this.props.change_model_type}
                                    fileId = {fileId}
                                    files={files}
                                    objectField={objectField}
                                    featureList={featureList}
                                    targetKeys={targetKeys}
                                    modelType={modelType}
                                    methodId={methodId}
                                    featureSelectWay={featureSelectWay}
                                    featureResult={featureResult}
                                    change_select_way={this.props.change_select_way}
                                    auto_feature={this.props.auto_feature}
                                    change_btn_state={this.props.change_btn_state}
                                    btnLoading={btnLoading}
                                    change_feature_spin={this.props.change_feature_spin}
                                    select_method={this.props.select_method}
                                    select_field={this.props.select_field}
            />,
        }, {
                title: '选择模型',
                content: <ModelSelect userId={this.props.userId} modelTypeName={modelTypeName}
                                      update_when_change={this.props.update_when_change}
                                      add_model_args={this.props.add_model_args}
                                      update_model_info={this.props.update_model_info}
                                      get_model={this.props.get_models}
                                      models={models}
                                      update_model = {this.props.update_model}
                                      modelDetailName={modelDetailName}
                                      modelArguments={modelArguments}
                                      modelDes={modelDes}
                                      modelId= {modelId}
                                      modelDetailDes={modelDetailDes}
                                      update_edit_true={this.props.update_edit_true}
                                      update_arg_value={this.props.update_arg_value}/>,
        }, {
                title: '完成',
                content: <ConfigInfoConfirm modelTypeName={modelTypeName}
                                            confName={confName}
                                            trainFeatureList={trainFeatureList}
                                            objectFeature={objectFeature}
                                            featureList={featureList}
                                            targetKeys={targetKeys}
                                            modelName={modelName}
                                            modelDetailName={modelDetailName}
                                            modelArguments={modelArguments}
                                            fileId = {fileId}
                                            submitInfos={this.submitInfos}/>,
            }];
        const steps = (
            <Steps current={stepCurrent}>
                {stepContent.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
        );
        var leftDisplay = stepCurrent <= 0 ? 'none' : 'block';
        let rightDisplay = stepCurrent >= stepContent.length-1 ? 'none' : 'block';
        if(this.props.configId !== null)   //如果是直接添加模型则不显示上一步
            leftDisplay = 'none';
        if(stepCurrent > 1) //第三步
            leftDisplay = 'block';

        rightDisplay=modelType==='dl'?'none':rightDisplay;
        return (
            <div style={{width:"100%"}}>
                <article className="add-config-page">
                    <div className="article-title">
                        {steps}
                    </div>
                    <div className="steps-content">
                        <Spin size="large" spinning={featureSpinLoading}>
                            {stepContent[stepCurrent].content}
                        </Spin>
                    </div>
                </article>
                <section className="config-step-footnote">
                    <div className="config-step-footnote-left">
                        <a style={{display:leftDisplay}} onClick={this.clickLeftStep}><Icon type="left" /> 上一步</a>
                    </div>
                    <div className="config-step-footnote-right">
                        <a style={{display:rightDisplay}} onClick={this.clickRightStep}>下一步 <Icon type="right" /></a>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = state=>({
    addConfigManage:state.addConfigManage
});

const mapDispatchToProps = dispatch =>({
    get_features:bindActionCreators(get_features,dispatch),
    get_files:bindActionCreators(get_files,dispatch),
    file_select:bindActionCreators(file_select,dispatch),
    update_config:bindActionCreators(update_config,dispatch),
    update_model:bindActionCreators(update_model,dispatch),
    feature_change:bindActionCreators(feature_change,dispatch),
    change_model_type:bindActionCreators(change_model_type,dispatch),
    change_step:bindActionCreators(change_step,dispatch),
    update_when_change:bindActionCreators(update_when_change,dispatch),
    add_model_args:bindActionCreators(add_model_args,dispatch),
    update_model_info:bindActionCreators(update_model_info,dispatch),
    get_models:bindActionCreators(get_models,dispatch),
    update_edit_true:bindActionCreators(update_edit_true,dispatch),
    update_arg_value:bindActionCreators(update_arg_value,dispatch),
    do_init:bindActionCreators(do_init,dispatch),
    change_select_way:bindActionCreators(change_select_way,dispatch),
    auto_feature:bindActionCreators(auto_feature,dispatch),
    change_btn_state:bindActionCreators(change_btn_state,dispatch),
    change_feature_spin:bindActionCreators(change_feature_spin,dispatch),
    select_method:bindActionCreators(select_method,dispatch),
    select_field:bindActionCreators(select_field,dispatch),
});

export default connect(mapStateToProps,mapDispatchToProps)(AddConfig)
