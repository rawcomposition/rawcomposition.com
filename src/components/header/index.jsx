import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

function Header() {
	return (
		<header className='main-header'>
			<div className='container'>
				<Link to='/' className='logo'>
					<img src='/logo.png' alt='' width='40'/>
					<span>RawComposition</span>
				</Link>
				<nav>
					<Link to='/'>Home</Link>
					<Link to='/about'>About</Link>
					<Link to='/lifelist'>Life list</Link>
				</nav>
			</div>
		</header>
	)
}

export default Header;