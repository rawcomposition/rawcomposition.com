import React from 'react';
import './styles.scss';

function Header() {
	return (
		<header className='main-header'>
			<div className='container'>
				<h1>
					<a href='/'>
						<img src='/logo.png' alt='' width='40'/>
						<span>RawComposition</span>
					</a>
				</h1>
			</div>
		</header>
	)
}

export default Header;