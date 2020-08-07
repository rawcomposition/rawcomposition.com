import React from 'react';
import Header from './components/header';
import Home from './pages/home';
import './App.scss';
import './normalize.css';

function App() {
	return (
		<React.Fragment>
			<Header/>
			<Home/>
		</React.Fragment>
	);
}

export default App;
