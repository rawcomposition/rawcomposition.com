import React from 'react';

function Header() {
	return (
		<header className='main-header'>
			<div className='container'>
				<a href='/' className='logo'>
					<img src='/logo.png' alt='' width='40'/>
					<span>RawComposition</span>
				</a>
				<nav>
					<a href='/'>Home</a>
					<a href='/about'>About</a>
					<a href='/lifelist'>Life list</a>
				</nav>
			</div>
		</header>
	)
}

export default Header;