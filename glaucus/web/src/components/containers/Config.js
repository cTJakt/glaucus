import React from 'react'
import * as _ from "underscore";
import '../../styles/Config.css'
import {get_all,change_config,change_file,change_configId,change_after_addition,change_add_id,change_config_menu,change_config_page_spin,
    init_config_page,update_config_list_add,get_configInfo
} from '../../redux/actions/Config'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ListConfigs from '../common/config/ListConfig'
import ConfigInfos from '../common/config/ConfigInfos'
import AddConfig from './AddConfig'
import { hashHistory } from 'react-router';
import Get from '../../utils/Get'
import {notification,Spin} from 'antd'
import {changePage} from '../../redux/actions/AppHeaderActions'
/**
 * Created by LXY on 2017/3/17.
 */
class Config extends React.Component {
    constructor(props) {
        super(props);
        this.addConfig = this.addConfig.bind(this);
        this.changeToAddConfig = this.changeToAddConfig.bind(this);
        this.deleteConfig = this.deleteConfig.bind(this);
        this.refreshAfterAddConfig = this.refreshAfterAddConfig.bind(this);
        this.getConfigChange = this.getConfigChange.bind(this);
    }

    componentWillMount(){
    }

    componentDidMount(){
        this.props.changePage("config");
        this.props.change_config_page_spin(true);
        this.props.init_config_page(this.props.userId);
    }
    addConfig() {    //点击添加模型
        hashHistory.push("/app/"+ this.props.userId +"/config/" + this.props.configManage.fileId);
        this.props.change_add_id(this.props.configManage.configId);
    }

    changeToAddConfig() {   //点击添加配置
        this.props.change_add_id(null);
        hashHistory.push("/app/"+ this.props.userId +"/config/addConfig")
        // this.props.change_add_id(null);
    }

    deleteConfig(configId){ //删除配置文件及所含的模型信息
        let configName =  (this.props.configManage.configArrays.filter((item) => (item.configId === configId))[0]).confName;
        Get("/api/config/delete?configId="+configId).then(res => {
            if(res['data']===true){ //若删除成功则重新加载界面
                notification["success"]({
                    message: configName,
                    description: "配置删除成功",
                });
                this.props.init_config_page(this.props.userId);
            }else{
                notification["error"]({
                    message: configName,
                    description: "配置删除失败",
                })
            }
        });
    }

    refreshAfterAddConfig(fileId,configId){ //添加配置或者模型之后刷新界面
        hashHistory.push("/app/"+ this.props.userId +"/config"+"/default");
        this.props.change_config_page_spin(true);
        this.props.update_config_list_add(this.props.userId ,fileId,configId);
    }

    getConfigChange(configId){
        let selectedFile = this.props.configManage.configArrays.filter((item)=>(item.configId===configId))[0];
        hashHistory.push("/app/"+ this.props.userId +"/config"+"/default");
        this.props.change_config_page_spin(true);
        this.props.get_configInfo(configId,selectedFile.fileName,selectedFile.confName);
    }

    render(){
        let configManage = this.props.configManage;
        let {configs,fileId,modelDetail,configId,configName,fileName,openKeys,addConfigId,currentConfigPage,configPageSpin,configArrays,configInfo} = configManage;
        let featureList=[];
        let modelTypeId="",modelTypeName="",modelData=[],modelDes="";
        if(configInfo!==undefined&&configInfo!==null ){ //配置信息不为空
            modelTypeId = configInfo.modelTypeId;
            modelTypeName = configInfo.modelTypeName;
            featureList=configInfo.featureList;
            modelData=configInfo.modelInfos;
            modelDes=configInfo.modelDes;
        }
        let change_file = this.props.change_file;
        let newFeatureList = _.map(featureList, feature => ({
            "fieldName": feature.fieldName,
            // "fieldType": fieldTypeDic[feature.fieldType]
            "fieldType": feature.fieldType
        }));

        const menuDetail = this.props.plus === 'default' ?
            <ConfigInfos configDetail={newFeatureList}
                         configName={configName}
                         modelTypeName={modelTypeName}
                         modelTypeId={modelTypeId}
                         modelData={modelData}
                         modelDes={modelDes}
                         fileName={fileName}
                         configId = {configId}
                         fileId = {fileId}
                         addConfig={this.addConfig}
                         configPageSpin={configPageSpin}
                         deleteConfig={this.deleteConfig}/>:
            <AddConfig plus={this.props.plus}
                       userId={this.props.userId}
                       configId={addConfigId}
                       modelTypeName={modelTypeName}
                       fileId = {fileId}
                       confName={configName}
                       trainFeatureList={featureList}
                       get_all={this.props.init_config_page}
                       refreshAfterAddConfig={this.refreshAfterAddConfig}/>;
        return(
            <div className="config-page">
                    <div className="sub-menu">
                        {/*<Spin size="large" spinning={configPageSpin}>*/}
                            <ListConfigs configs={configs}
                                         fileId={fileId}
                                         getConfigChange={this.getConfigChange}
                                         modelDetail = {modelDetail}
                                         configArrays={configArrays}
                                         configId = {configId}
                                         change_file={change_file}
                                         openKeys={openKeys}
                                         changeToAddConfig={this.changeToAddConfig}
                                         change_config_menu={this.props.change_config_menu}
                                         currentConfigPage={currentConfigPage}
                            />
                        {/*</Spin>*/}
                    </div>
                    <div className="menu-detail">
                        {/*<Spin size="large" spinning={configPageSpin}>*/}
                            {menuDetail}
                        {/*</Spin>*/}
                    </div>
            </div>
        );
    }
}

const mapStateToProps = state=>({
    configManage:state.configManage,
});

const mapDispatchToProps = dispatch =>({
    get_all:bindActionCreators(get_all,dispatch),
    change_config:bindActionCreators(change_config,dispatch),
    change_file:bindActionCreators(change_file,dispatch),
    change_configId:bindActionCreators(change_configId,dispatch),
    change_after_addition:bindActionCreators(change_after_addition,dispatch),
    changePage:bindActionCreators(changePage,dispatch),
    change_add_id:bindActionCreators(change_add_id,dispatch),
    change_config_menu:bindActionCreators(change_config_menu,dispatch),
    change_config_page_spin:bindActionCreators(change_config_page_spin,dispatch),
    init_config_page:bindActionCreators(init_config_page,dispatch),
    update_config_list_add:bindActionCreators(update_config_list_add,dispatch),
    get_configInfo:bindActionCreators(get_configInfo,dispatch),
});

export default connect(mapStateToProps,mapDispatchToProps)(Config)
