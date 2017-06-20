import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {notification,Spin} from 'antd'
import {hashHistory} from 'react-router'
import {getFile,getFileInfo,update_header_info,get_pagination,update_ana_button,get_header_id,change_visible,change_field_list,
    select_function,init_file,get_ana_result,change_upload_btn,get_ana_functions,menu_page_change,update_file_id} from '../../redux/actions/FileManage'
import {changePage} from '../../redux/actions/AppHeaderActions'
import ListFiles from '../common/file/ListFiles'
import FileInfo from '../common/file/FileInfo'
import '../../resources/Home.css'
import SearchInput from '../common/file/SearchInput'
import UploaderButtons from '../common/file/UploaderButtons'
import Get from '../../utils/Get'
import Post from '../../utils/Post'
import MyNotification from '../../utils/MyNotification'
/**
 * Created by LXY on 2017/3/10.
 */
class FileManage extends React.Component{

    constructor(props){
        super(props);
        this.analysisFile = this.analysisFile.bind(this);
        this.jumpToAddConfig = this.jumpToAddConfig.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.saveHeaders = this.saveHeaders.bind(this);
        this.analysisFields = this.analysisFields.bind(this);
        this.updateAfterUpload = this.updateAfterUpload.bind(this)
    }

    componentWillMount(){
    }

    componentDidMount(){
        // this.props.init_file();
        this.props.getFiles(this.props.fileManage.userId);
        this.props.get_ana_functions();
        this.props.changePage("fileManage");
    }

    analysisFile(fileId, callback) { //分析文件
        notification["info"]({
            message: this.props.fileManage.fileDetailData.fileName,
            description: "文件开始分析",
        });
        Get("/api/file/analysis?fileId=" + fileId).then(res => {
            if (res!==null) {
                this.props.getFileInfo(this.props.fileManage.fileId);
                MyNotification('success',this.props.fileManage.fileDetailData.fileName,"文件分析完成");
                this.props.getFiles(this.props.fileManage.userId); //重新文件获取信息
                callback(true);
            } else {
                MyNotification('error',this.props.fileManage.fileDetailData.fileName,"文件分析失败");
                callback(false);
            }
        })
    }

    jumpToAddConfig(fileId) {   //跳转到添加配置界面
        hashHistory.push("/app/"+ this.props.userId +"/config"+"/"+fileId);
    }

    deleteFile(fileId){ //删除文件
        Get("/api/file/delete?fileId="+fileId).then(res => {
            if(res['data']===true){ //若删除成功则重新加载界面
                notification["success"]({
                    message: this.props.fileManage.fileDetailData.fileName,
                    description: "文件删除成功",
                })
                this.props.getFiles(this.props.fileManage.userId);
            }else{
                notification["error"]({
                    message: this.props.fileManage.fileDetailData.fileName,
                    description: "文件删除失败",
                })
            }
        });
    }

    saveHeaders(headerUpdateInfos) {   //保存所更改的文件信息

        if(headerUpdateInfos.length===0){   //若未更改过头文件信息，则不需要保存
            notification["info"]({
                message: this.props.fileManage.fileDetailData.fileName,
                description: '信息未更改过，不需要更新！',
            })
        }else{
            let headerInfoUpdate = {
                headerInfo:this.props.fileManage.fileDetailData.fileDetail,    //该文件的所有头文件信息
                headerNeedUpdate:headerUpdateInfos          //更改过的头文件信息
            }
            Post("/api/file/update", JSON.stringify(headerInfoUpdate)).then(res => {
                if (res['status'] === 200) {
                    notification["success"]({
                        message: this.props.fileManage.fileDetailData.fileName,
                        description: '信息保存成功',
                    })
                }else{
                    notification["error"]({
                        message: this.props.fileManage.fileDetailData.fileName,
                        description: '信息保存失败',
                    })
                }
            });
        }
    }

    analysisFields(){  //对所选的字段进行分析,并获取分析结果
        this.props.get_ana_result([],true); //重置分析的结果，按钮进入等待
        // let analysisInfo  = {
        //     selectFields:this.props.fileManage.modalData.targetKeys,    //需要分析的字段id，arrays
        //     selectFunction:this.props.fileManage.selectFunction,    //选择的分析函数
        // };

        // Post("/api/file/analysis/fields", JSON.stringify(analysisInfo)).then(res => {
        Get("/api/file/analysis/fields?fieldIds=" +this.props.fileManage.modalData.targetKeys+"&funcId="+this.props.fileManage.selectFunction).then(res => {
            if (res['status'] === 200) {
                notification["success"]({
                    message: this.props.fileManage.fileDetailData.fileName,
                    description: '字段分析完成',
                })
                this.props.get_ana_result(res['data'],false); //获取分析的结果，按钮重置
            }else{
                notification["error"]({
                    message: this.props.fileManage.fileDetailData.fileName,
                    description: '字段分析失败',
                })
                this.props.get_ana_result([],false); //失败则结果为空数组，按钮重置
            }
        });
    }

    updateAfterUpload(){    //文件上传成功后刷新界面
        this.props.getFiles(this.props.fileManage.userId);
    }

    render(){

        let {fileManage,getFileInfo} = this.props;
        let {maxCell,currentPage,analysedTxt,analysed,headersNeedUpdate,modalData,selectFunction,anaFunctions,functionDescription,fileUploading,currentMenuPage,imageData} = fileManage;
        let userId = fileManage.userId,fileId = fileManage.fileId;
        let files = fileManage.filesData.files;
        let {fileName, fileDetail, createTime, fileInfo} = fileManage.fileDetailData;
        // fileActions.getFiles(userId);
        return (
            <div className="home-page">
                <div className="sub-menu">
                    <SearchInput placeholder="输入文件名"
                                 onSearch={value => console.log(value)} style={{ width: '85%'}} />
                    <UploaderButtons userId={userId} refreshFunc={this.updateAfterUpload} fileUploading={fileUploading} change_upload_btn={this.props.change_upload_btn}/>
                    <ListFiles files={files}
                               getFileInfo = {getFileInfo}
                               fileId={fileId}
                               menu_page_change={this.props.menu_page_change}
                               currentMenuPage={currentMenuPage}
                               imageData={imageData}
                               update_file_id={this.props.update_file_id}
                               />
                </div>
                <div className="menu-detail">
                    <FileInfo data={fileDetail}
                              fileName={fileName}
                              fileId={fileId}
                              createTime={createTime}
                              fileInfo={fileInfo}
                              currentPage={currentPage}
                              maxCell={maxCell}
                              update_header_info={this.props.update_header_info}
                              get_pagination={this.props.get_pagination}
                              analysedTxt={analysedTxt}
                              analysed={analysed}
                              modalData={modalData}
                              analysisFile={this.analysisFile}
                              addConfig={this.jumpToAddConfig}
                              update_ana_button={this.props.update_ana_button}
                              deleteFile={this.deleteFile}
                              get_header_id={this.props.get_header_id}
                              headersNeedUpdate={headersNeedUpdate}
                              saveHeaders={this.saveHeaders}
                              change_visible={this.props.change_visible}
                              change_field_list={this.props.change_field_list}
                              analysisFields={this.analysisFields}
                              select_function={this.props.select_function}
                              selectFunction={selectFunction}
                              anaFunctions={anaFunctions}
                              functionDescription={functionDescription}
                              imageData={imageData}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state=>({
    fileManage:state.fileManage,
    headerManage:state.headerManage
});

const mapDispatchToProps = dispatch =>({
    getFiles:bindActionCreators(getFile,dispatch),
    getFileInfo:bindActionCreators(getFileInfo,dispatch),
    update_header_info:bindActionCreators(update_header_info,dispatch),
    get_pagination:bindActionCreators(get_pagination,dispatch),
    update_ana_button:bindActionCreators(update_ana_button,dispatch),
    changePage:bindActionCreators(changePage,dispatch),
    get_header_id:bindActionCreators(get_header_id,dispatch),
    change_visible:bindActionCreators(change_visible,dispatch),
    change_field_list:bindActionCreators(change_field_list,dispatch),
    select_function:bindActionCreators(select_function,dispatch),
    init_file:bindActionCreators(init_file,dispatch),
    get_ana_result:bindActionCreators(get_ana_result,dispatch),
    change_upload_btn:bindActionCreators(change_upload_btn,dispatch),
    get_ana_functions:bindActionCreators(get_ana_functions,dispatch),
    menu_page_change:bindActionCreators(menu_page_change,dispatch),
    update_file_id:bindActionCreators(update_file_id,dispatch),
});

export default connect(mapStateToProps,mapDispatchToProps)(FileManage)