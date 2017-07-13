import React 						from 'react'
import { Route,IndexRoute } 		from 'react-router'
import NotFoundPage 				from '../components/NotFoundPage'
import App                          from '../container/index'
import AppIndex                     from '../container/AppIndex'

export default (
	<Route>
        <Route name="首頁" 	component={App} 	path="/" >
			<IndexRoute 	component={AppIndex} />
        </Route>
		<Route component={NotFoundPage} path="*"/>
	</Route>
)
