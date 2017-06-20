import React from 'react'
import Strings from '../resources/values/string'
import Dimens from '../resources/values/dimens'
import {Row, Col} from 'antd';
/**
 * Created by LXY on 2017/3/14.
 */
class AppNotes extends React.Component {
    render() {
        return (
            <Row type="flex" align="middle" style={{height:Dimens.appNoteHeight+'px', backgroundColor:"white"}}>
                <Col style={{marginLeft:"5%"}}>
                    <span>{Strings.labsName}</span>
                </Col>
            </Row>
        );
    }
}

export default AppNotes