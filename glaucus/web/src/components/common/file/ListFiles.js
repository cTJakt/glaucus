import React from 'react'
import {Menu, Pagination,Icon} from 'antd';
import '../../../resources/ListFiles.css'

/**
 * Created by LXY on 2017/3/10.
 */
const SubMenu = Menu.SubMenu;

class ListFiles extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    handleClick(e) {
        if(e.key==="image_train_x"||e.key==="image_train_y"||e.key==="image_test_x"||e.key==="image_test_y"){
            this.props.update_file_id(e.key);
            return;
        }
        console.log('click ', e);
        this.props.getFileInfo(e.key);
    }

    onChange(page){
        console.log(page);
        this.props.menu_page_change(page);
    }
    render(){
        let imageData=this.props.imageData; //图像数据
        let start=(this.props.currentMenuPage - 1) * 10;
        let end=this.props.currentMenuPage * 10;
        let nowFiles = this.props.files.slice(start,end);
        let files = nowFiles.map(file => {
            return (
                <Menu.Item key={file.fileId}>
                    <div className="file-menu-item">{file.fileName}</div>
                </Menu.Item>
            );
        });

        // let imageMenu=<SubMenu key="image" title={<span><Icon type="folder" /><span className="file-menu-item">mnist</span></span>}  mode="inline">
        //     <Menu.Item key="image_train_x"><div className="file-menu-item">x_train</div></Menu.Item>
        //     <Menu.Item key="image_train_y"><div className="file-menu-item">y_train</div></Menu.Item>
        //     <Menu.Item key="image_test_x"><div className="file-menu-item">x_test</div></Menu.Item>
        //     <Menu.Item key="image_test_y"><div className="file-menu-item">y_test</div></Menu.Item>
        // </SubMenu>;
        //
        // files.push(imageMenu);
        return(
            <div className="menu-page">
                {/*{ console.log("运行到ListFile render!!!!!")}*/}
                <Menu className="file-menu1"
                    onClick = {this.handleClick}
                    selectedKeys={[this.props.fileId]}>
                    {files}
                </Menu>
                <Pagination simple current={this.props.currentMenuPage} onChange={this.onChange}  total={this.props.files.length}/>
            </div>
        );
    }
}

export default ListFiles;