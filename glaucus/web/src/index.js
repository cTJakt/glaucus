import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware  } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducers/RootReducer'
import './index.css';
import 'antd/dist/antd.css'
import Router from './Routers'

import thunk  from 'redux-thunk';
import thunkMiddleware from 'redux-thunk'

const store = createStore(rootReducer,applyMiddleware(
    thunk,
    thunkMiddleware)
);

ReactDOM.render(
    <Provider store={store}>
        <Router />
    </Provider>,
  document.getElementById('root')
);
