import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import About from './pages/about';
import Lifelist from './pages/lifelist';
import './app.scss';
import './normalize.css';

function App() {
	return (
		<React.Fragment>
			<Header/>
			<Switch>
				<Route exact path='/' component={Home}/>
				<Route path='/about' component={About}/>
				<Route path='/lifelist' component={Lifelist}/>
			</Switch>
		</React.Fragment>
	);
}

export default App;
