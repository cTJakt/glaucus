/**
 * Created by LXY on 2017/6/4.
 */
import React from 'react'
import {ListGroup,ListGroupItem,Glyphicon} from 'react-bootstrap'
import '../../../styles/DLFileInfo.css'

class DLFileInfo extends React.Component{
    constructor(props){
        super(props);
        this.itemClick=this.itemClick.bind(this);
    };

    itemClick(categoryId){        //跳转到每个列表下的图片，并且将页面深度改为2
        this.props.change_page_index(2);
        this.props.change_class(categoryId);  //改变选中的类别
        this.props.change_class_spin(true);     //开始加载图片信息
        this.props.get_image(categoryId);
    }

    render(){
        let {imageClass} = this.props;
        let classItems=imageClass.map(classes => {
            return (
                <ListGroupItem className="list-group-item" onClick={()=>this.itemClick(classes.categoryId)}>
                    <div className="folder-icon"><Glyphicon glyph="folder-close" className="folder-icon"/></div>
                    <div className="item-text">{classes.categoryName}</div>
                </ListGroupItem>
            );
        });
        return(
            <div>
                <ListGroup className="img-list-div">
                    {classItems}
                </ListGroup>
            </div>
        );
    }
}

export default DLFileInfo;