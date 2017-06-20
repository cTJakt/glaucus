/**
 * Created by LXY on 2017/6/4.
 */
import React from 'react'
import {Menu, Pagination,Icon} from 'antd';
import '../../../styles/DLFileList.css'

class DLFileList extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleClick(e) {    //点击文件,获取文件下的类别信息
        this.props.change_folder(e.key);
        this.props.get_classes(e.key);
        this.props.change_page_index(1);        //只显示但当前文件目录一级
    }

    onChange(page) {     //切换menu的页码
        this.props.change_list_page(page);
    }

    render() {
        let {menuPage,selectFolder,imageFolders} = this.props;
        let pageSize=20;
        let start=(menuPage - 1) * pageSize;
        let end=menuPage * pageSize;
        let nowFiles = imageFolders.slice(start,end);       //分页功能
        let menuItems=nowFiles.map(file => {
            return (
                <Menu.Item key={file.fileId}>
                    <div className="file-menu-item">{file.fileName}</div>
                </Menu.Item>
            );
        });
        return (
            <div className="menu-page">
                <Menu className="file-menu1"
                      onClick = {this.handleClick}
                      selectedKeys={[selectFolder]}>
                    {menuItems}
                </Menu>
                <Pagination simple pageSize={pageSize} current={menuPage} onChange={this.onChange}  total={imageFolders.length} />
            </div>
        );

    }
}
export default DLFileList