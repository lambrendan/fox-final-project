import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom"
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reduce from './reducers/reducers.js'

const middleware = [thunk];

const store = createStore(reduce, applyMiddleware(...middleware));

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <App /> 
        </BrowserRouter>
    </Provider>),
    document.getElementById('root'))


