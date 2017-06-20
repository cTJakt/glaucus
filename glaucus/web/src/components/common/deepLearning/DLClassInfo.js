import React from 'react'
import {ListGroupItem,ListGroup,Image,Button,Glyphicon} from 'react-bootstrap'
import {Modal,Select,BackTop,Spin,message} from 'antd'
import Strings from '../../../resources/values/string'
import '../../../styles/DLClassInfo.css'
// import Modal from "antd/lib/modal/Modal.d";
/**
 * Created by LXY on 2017/6/6.
 */
class DLClassInfo extends React.Component{
    constructor(props){
        super(props);
        this.itemOnclick=this.itemOnclick.bind(this);
        this.handelCloseOk=this.handelCloseOk.bind(this);
        this.handelCancel=this.handelCancel.bind(this);
        this.handelOk=this.handelOk.bind(this);
        this.backToFolder=this.backToFolder.bind(this);
        this.handleChange=this.handleChange.bind(this);
    }

    itemOnclick(item){      //点击查看图片
        this.props.change_select_image(item);   //改变选中的图片
        this.props.change_modal_state(true);
    }

    handelCloseOk(){    //点击其他空白区域关闭
        this.props.change_modal_state(false);
    }

    handelCancel(){     //点击取消或者右上角关闭符号
        this.props.change_modal_state(false);
    }

    handelOk(){         //点击确认更改
        if(this.props.changedClass===""){   //未选择时
            message.error("请先选择要改变的类别！");
            return;
        }
        if(this.props.changedClass===this.props.selectClass){   //类别未改变时
            message.error("类别未发生变化！");
            return;
        }
        this.props.changeImageClass(this.props.changedClass);
    }

    backToFolder(){     //返回上一级
        this.props.change_page_index(1);
    }

    handleChange(value){     //选择的类别发生变化
        this.props.update_image_class(value);
    }

    render(){
        let {images,modalState,selectImage,imageClass,changedClass,nowSelectClass,classSpinState}=this.props;
        let imageItems=images.map(item => {
            return (
                    <ListGroupItem className="list-group-item">
                        <div className="folder-icon"><Glyphicon glyph="picture"/></div>
                        <div className="item-text"><a onClick={()=>this.itemOnclick(item)}>{item.picName}</a></div>
                    </ListGroupItem>
            );
        });

        let selectFunctionOptions=imageClass.map(item => {
            return (
                <Option value={item.categoryId}>{item.categoryName}</Option>
            );
        });
        return(
            <div className="img-list-div">
                <BackTop/>
                <div className="backTo"><label>{nowSelectClass}>></label><a onClick={this.backToFolder}>返回上一级</a></div>
                <div>
                    <Spin spinning={classSpinState}>
                        <ListGroup>
                            {imageItems}
                        </ListGroup>
                    </Spin>
                </div>
                <Modal
                    visible={modalState}
                    title="选择字段"
                    width="630"
                    onOk={this.handelCloseOk}
                    onCancel={this.handelCancel}
                    footer={[
                        <Button key="submit" type="primary" size="large" onClick={this.handelOk}>
                            更改图片类别
                        </Button>,
                        <Button key="back" size="large" onClick={this.handelCancel}>取消</Button>,
                    ]}
                >
                    <label>{Strings.nowClass}</label>{nowSelectClass}
                    <Image src={selectImage===""?"":selectImage.picLoc} responsive/>
                    <Select className="select"
                            showSearch
                            style={{ width: 300}}
                            placeholder="选择类别"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {selectFunctionOptions}
                    </Select>
                </Modal>
            </div>
        );
    }
}

export default DLClassInfo;
