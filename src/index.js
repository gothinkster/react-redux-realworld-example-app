import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux'; 
import store from './store';

import Home from './components/Home';
import Login from './components/Login';
import Header from './components/Header';


import { BrowserRouter, Route, Switch } from 'react-router-dom';


ReactDOM.render((
	<Provider store={store}>
		<BrowserRouter>
			<div>
				<Header appName="conduit" />
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/" component={Home} />
				</Switch>
			</div>			
		</BrowserRouter>
	</Provider> 
), document.getElementById('root'));