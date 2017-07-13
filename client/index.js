import React, { Component } 							from 'react';
import { render } 										from 'react-dom';
import { Router, Route, RouterContext, browserHistory } from 'react-router';
import { Provider } 									from 'react-redux';
import configureStore 									from '../common/utils/configureStore';
import routes 											from '../common/routes/routing';
import 'bootstrap'
import "../client/assets/css/bootstrap.css"
import "../client/assets/css/style.css"


let state = null;

if ( window.$REDUX_STATE ) {

	// 解開 server 預先傳來的資料包，稍後會放入 store 成為 initState
	state = window.$REDUX_STATE;
}

const store = configureStore( state )

// 注意 <Provider> 是 react-redux 提供的元件，不屬於 react-router
render(
	<div className="app">
	<Provider store={store}>
		<Router history={browserHistory} routes={routes} />
	</Provider>
		</div>,
	document.querySelector( '#container' )
);

