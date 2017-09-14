import React from 'react'
import { Button, Upload, Row, Col, message} from 'antd';
import Strings from '../../../resources/values/string'
/**
 * upload button and create folder button
 * Created by lucas on 2016/11/14.
 */
class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleBeforeUpload = this.handleBeforeUpload.bind(this);
        this.state = {filename: null};
    }
    handleBeforeUpload(file) {
        this.props.change_upload(true);
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
                this.props.get_file_info(info.file.response.data.fileId,this.state.filename,info.file.response.data.values);
            } else {
                message.error(`${info.file.name} 上传失败`);
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`);
        }
        this.props.change_upload(false);
    }
    render() {
        const props = {
            name: 'file',
            headers:{
                "authorization":'Bearer '+sessionStorage.token,
            },
            action: Strings.serverAddr + '/api/model/use/upload',
            data: {
                'fileName': this.state.filename,
                'userId' : this.props.userId
            },
            onChange: this.handleUpload,
            beforeUpload: this.handleBeforeUpload,
            accept: ".csv,.sas7bdat"
        };
        return (
            <Row type="flex" gutter={0} style={{width:'85%', marginTop:'20px'}}>
                <Col span={12}>
                    <Upload {...props}>
                        <Button  icon="upload" loading={this.props.uploadLoading}>上传</Button>
                    </Upload>
                </Col>
            </Row>
        );
    }
}

export default FileUpload