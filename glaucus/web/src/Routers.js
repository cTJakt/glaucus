import React from 'react'
import {Router,Route,hashHistory} from 'react-router'
import LoginPage from './components/containers/LoginForm'
import App from './App'
/**
 * Created by LXY on 2017/3/14.
 */
const Routers = React.createClass({
    render(){
        return(
            <Router history={hashHistory}>
                <Route path="/" component={LoginPage}/>
                <Router path="/app/:userId/:tag/:plus" component={App}/>
            </Router>
        );
    }
});

export default Routers;

