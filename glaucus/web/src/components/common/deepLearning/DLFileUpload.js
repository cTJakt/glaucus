import React from 'react'
import { Button, Upload, Row, message,Col} from 'antd';
import Strings from '../../../resources/values/string'
/**
 * upload button and create folder button
 * Created by lucas on 2016/11/14.
 */
class DLFileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleBeforeUpload = this.handleBeforeUpload.bind(this);
        this.state = {filename: null};
    }
    handleBeforeUpload(file) {
        this.setState({
            filename: file.name
        });
        const formatCorrect = file.name === null;
        if (formatCorrect) {
            message.error('请选择正确文件上传');
        }
        return !formatCorrect;
    }
    handleUpload(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            if (info.file.response.status === 200) {
                message.success(`${info.file.name} 上传成功`);
                this.props.refreshFunc();
            } else {
                message.error(`${info.file.name} 上传失败`);
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`);
        }
    }
    render() {
        const props = {
            name: 'file',
            action: Strings.serverAddr + '/api/picture/upload',
            data: {
                'fileName': this.state.filename,
                'userId' : this.props.userId
            },
            onChange: this.handleUpload,
            beforeUpload: this.handleBeforeUpload,
            accept: ".rar,.zip"
        };
        return (
            <Row type="flex" gutter={0} style={{width:'100%', marginTop:'20px'}}>
                <Col span={10}>
                    <Upload {...props}>
                        <Button type="primary" icon="upload" >上传</Button>
                    </Upload>
                </Col>
                <Col span={10} offset={4}>
                    <Button type="dashed" onClick={this.props.goToModel} icon="area-chart" >模型</Button>
                </Col>
            </Row>
        );
    }
}

export default DLFileUpload