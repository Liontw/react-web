import express 								from 'express';
import path 								from 'path';
import React 								from 'react'
import { renderToString } 					from 'react-dom/server'
import { Router, RouterContext, match } 	from 'react-router';
import routes 								from '../common/routes/routing';
import { applyMiddleware, createStore } 	from 'redux';
import { Provider } 						from 'react-redux';
import promiseMiddleware 					from '../common/middlewares/promiseMiddleware';
import combinedReducers 					from '../common/reducers';
import fetchComponentData 					from '../common/utils/fetchComponentData';
import NotFoundPage 						from '../common/components/NotFoundPage';


const finalCreateStore = applyMiddleware(promiseMiddleware)( createStore );
// console.log( 'env: ', process.env.NODE_ENV )

const app = express();

app.use('/assets', express.static(path.join(__dirname, '../client/assets')))
app.use('/style', express.static(path.join(__dirname, '../build')))


// initialize webpack HMR
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../webpack.config')
const compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { hot: true, noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// server rendering
app.use( ( req, res, next ) => {

	// 建立一個新的 Redux store 實體
	const store = finalCreateStore(combinedReducers);
	// const metaTagsInstance = MetaTagsServer();

	// react-router
	match( {routes, location: req.url}, ( error, redirectLocation, renderProps ) => {

		if ( error )
			return res.status(500).send( error.message );

		if ( redirectLocation )
			return res.redirect( 302, redirectLocation.pathname + redirectLocation.search );

		if ( renderProps == null ) {
			// return next('err msg: route not found'); // yield control to next middleware to handle the request
			const initView = renderToString((
				<div className="app">
					<Provider store={store}>
							<NotFoundPage/>
					</Provider>
				</div>
			))
			// const meta = metaTagsInstance.renderToString();
			let state = JSON.stringify( store.getState() );
			let page = renderFullPage( initView, state)
			return res.status(404).send( page );
			// return res.status(404).send('Not found11');
		}

		fetchComponentData( store.dispatch, renderProps.components, renderProps.params)

		.then( () => {

			// 把 component Render 成字串
				const initView = renderToString((
					<div className="app">
					<Provider store={store}>
					  		<RouterContext {...renderProps} />
					</Provider>
						</div>
				))

			// const meta = metaTagsInstance.renderToString();

			// console.log('\ninitView:\n', initView);

			let state = JSON.stringify( store.getState() );
			// console.log( '\nstate: ', state )

			let page = renderFullPage( initView, state)
			// console.log( '\npage:\n', page );

			return page;
		})
		.then( page => res.status(200).send(page) )
		.catch( err => res.end(err.message) );

	})
})

function renderFullPage(html, initialState) {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<html xmlns:og='http://ogp.me/ns#'>
<!--[if IE 9]>
<html class="lt-ie10" lang="en"> <![endif]-->
<html class="no-js" lang="zh-TW">
	  <head>   
	    <meta http-equiv="Content-Type" 	content="text/html; charset=utf-8"/>
    	<meta name="viewport" 				content="width=device-width, 	initial-scale=1.0, 	user-scalable=yes"/>
	
		<link rel="shortcut icon" type="image/png"  href="http://i.imgur.com/hU8wl6a.png">
		<link rel="stylesheet" 						href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"/>
		<link rel="stylesheet" 						href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css"/>
		<link rel="stylesheet" 						href="/style/styles.css">
		
		<meta name="google-site-verification" 		content="cOMNMTti3mhHHenqBpVhfOvmN1kE0OftVff2p1f2uS4" />
  		<meta name="google" 						content="nositelinkssearchbox" />
		
		<script type="text/javascript" 	src="//www.googleadservices.com/pagead/conversion.js"></script>
   		<script type="text/javascript" 	src="//www.googleadservices.com/pagead/conversion_async.js" charset="utf-8"></script>
	   	<script 						src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	   	<script 						src="http://code.jquery.com/jquery-latest.min.js"></script>
	   	
	   	
	    <!-- Include Required Prerequisites -->
		<script type="text/javascript" src="//cdn.jsdelivr.net/jquery/1/jquery.min.js"></script>
		<script type="text/javascript" src="//cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
		<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap/3/css/bootstrap.css" />
 
	   	
	  </head>
	  <body>
	  <div id="container">${html}</div>
		<script>window.$REDUX_STATE = ${initialState}</script>
		<script src="/static/bundle.js"></script>
	  </body>
	  
	</html>
	`
}

// example of handling 404 pages
app.get('*', function(req, res) {
	res.status(404).send('Server.js > 404 - Page Not Found');
})

// global error catcher, need four arguments
app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);
  res.status(500).send("Server error");
});

process.on('uncaughtException', evt => {
  console.log( 'uncaughtException: ', evt );
})

app.listen(3001, function(){
	console.log('Listening on port 3001');
});


