/**
 * Created by LXY on 2017/6/4.
 */
import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Button,Checkbox,Icon,notification} from 'antd'
import DLFileInfo from '../common/deepLearning/DLFileInfo'
import DLFileUpload from '../common/deepLearning/DLFileUpload'
import DLFileList from '../common/deepLearning/DLFileList'
import DLClassInfo from '../common/deepLearning/DLClassInfo'
import DLModel from './DLModel'
import AddDLModel from './AddDLModel'
import '../../styles/DLImage.css'
import Get from '../../utils/Get'
import {changePage} from '../../redux/actions/AppHeaderActions'
import {get_folders,get_classes,get_image,change_class,change_folder,change_page_index,change_list_page,change_modal_state
    ,update_image_class,init_get_all,change_class_spin,change_select_image} from '../../redux/actions/DLImageActions'
import {hashHistory} from 'react-router'

class DLImage extends React.Component{
    constructor(props){
        super(props);
        this.changeImageClass=this.changeImageClass.bind(this);
        this.goToModel=this.goToModel.bind(this);
    }


    componentDidMount(){
        this.props.changePage("deepLearning");
        this.props.init_get_all(this.props.userId);
    }

    changeImageClass(nowClass){      //更新图片的类别信息
        let newTag= this.props.dlImageReducer.imageClass.filter((item) => (item.categoryId === nowClass))[0].categoryName;

        let image=this.props.dlImageReducer.selectImage;
        let imageId=image.picId;
        Get("/api/picture/update/picinfo?picId=" +imageId+"&picTag="+newTag+"&picCategory="+nowClass).then(res => {
            if(res['status']===200){ //更改成功，重新获取当前类别的图片信息
                notification["success"]({
                    message: image.picName,
                    description: "更改成功",
                });
                this.props.change_modal_state(false);   //关闭对话框
                this.props.get_image(this.props.dlImageReducer.selectClass);    //重新获取当前类别的图片
            }else{
                notification["error"]({
                    message: image.picName,
                    description: "更改失败",
                })
            }
        });
    }

    goToModel(){
        this.props.change_modal_state(false);
        hashHistory.push("/app/"+ this.props.userId +"/deepLearning/model");
    }

    render() {

        let {imageFolders,imageClass,images,selectFolder,selectClass,selectImage,pageIndex,menuPage,modalState,changedClass,classSpinState} = this.props.dlImageReducer;
        let plus=this.props.plus;
        let nowClass= imageClass.filter((item) => (item.categoryId === selectClass));
        let nowSelectClass=nowClass.length===0?"":nowClass[0].categoryName;

        let mainPage=[];    //记录当前界面显示的内容
        mainPage= pageIndex===1?<DLFileInfo change_class={this.props.change_class}
                                            change_page_index={this.props.change_page_index}
                                            get_image={this.props.get_image}
                                            change_class_spin={this.props.change_class_spin}
                                            imageClass={imageClass}/>           //为1显示folder下面的分类，为2显示分类下面的图片信息
            :<DLClassInfo images={images}
                          change_page_index={this.props.change_page_index}
                          modalState={modalState}
                          selectImage={selectImage}
                          imageClass={imageClass}
                          change_modal_state={this.props.change_modal_state}
                          changeImageClass={this.changeImageClass}
                          update_image_class={this.props.update_image_class}
                          changedClass={changedClass}
                          nowSelectClass={nowSelectClass}
                          classSpinState={classSpinState}
                          change_select_image={this.props.change_select_image}
                          selectClass={selectClass}
            />;

            let page=[];
            if(plus==="default"){
                page=<div className="home-page">
                    <div className="sub-menu">
                        <div className="dl-button-group">
                            <DLFileUpload userId={this.props.userId} style={{ width: '85%'}}
                                          goToModel={this.goToModel}
                            />
                        </div>
                        <DLFileList change_list_page={this.props.change_list_page}
                                    change_folder={this.props.change_folder}
                                    menuPage={menuPage}
                                    selectFolder={selectFolder}
                                    imageFolders={imageFolders}
                                    get_classes={this.props.get_classes}
                                    change_page_index={this.props.change_page_index}
                        />
                    </div>
                    <div className="carousel-page">
                        <h3 className="img-list-title">图片文件列表</h3>
                        {mainPage}
                    </div>
                </div>;
            }else if(plus==="model"){
                page=<DLModel userId={this.props.userId}/>;
            }else if(plus==="addModel"){
                page=<AddDLModel userId={this.props.userId}/>;
            }
        return (
            <div className="home-page">
                {page}
            </div>
        );
    }
}

const mapStateToProps = state=>({
    dlImageReducer:state.dlImageReducer,
});

const mapDispatchToProps = dispatch =>({
    get_folders:bindActionCreators(get_folders,dispatch),
    get_image:bindActionCreators(get_image,dispatch),
    get_classes:bindActionCreators(get_classes,dispatch),
    change_folder:bindActionCreators(change_folder,dispatch),
    change_class:bindActionCreators(change_class,dispatch),
    change_page_index:bindActionCreators(change_page_index,dispatch),
    change_list_page:bindActionCreators(change_list_page,dispatch),
    change_modal_state:bindActionCreators(change_modal_state,dispatch),
    update_image_class:bindActionCreators(update_image_class,dispatch),
    init_get_all:bindActionCreators(init_get_all,dispatch),
    changePage:bindActionCreators(changePage,dispatch),
    change_class_spin:bindActionCreators(change_class_spin,dispatch),
    change_select_image:bindActionCreators(change_select_image,dispatch),
});

export default connect(mapStateToProps,mapDispatchToProps)(DLImage)