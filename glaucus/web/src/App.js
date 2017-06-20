import React from "react";
import AppHeader from './utils/AppHeader'
import FileManage from './components/containers/FileManage'
import Config from './components/containers/Config'
import Model from './components/containers/Model'
import DeepLearning from './components/containers/DLImage'
// import Model from './model/Model'
import './App.css'
/**
 * The Skeleton of the whole app
 * Created by lucas on 2016/11/23.
 */
const userId = '582468b2f995e5ce9ed99007';
class App extends React.Component {
    render() {
        const tag = this.props.params.tag;
        const plus = this.props.params.plus;
        let content = [];
        switch (tag) {
            case 'fileManage':
                content = <FileManage userId={userId}/>;
                break;
            case 'config':
                content = <Config userId={userId} plus={plus}/>;
                break;
            case 'model' :
                content = <Model userId={userId}/>;
                break;
            case 'deepLearning':
                content=<DeepLearning  userId={userId}  plus={plus}/>

            default:
            //nothing
        }
        return (
            <div>
                <AppHeader isLogin={false} userId={userId} tag={tag}/>
                <div className="main-page">
                    {content}
                </div>
            </div>
        );
    }
}

export default App;
