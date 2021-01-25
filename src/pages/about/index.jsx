import React from 'react';
import Sidebar from '../../components/sidebar';
import './styles.scss';

function About() {
	return (
		<div className='container page-wrapper'>
			<div className="page content">
				<img src='/me.jpg' alt='' className='bio-image'/>
				<p>I'm a web developer that loves chasing rare birds around world. I developed an interest in bird photography at the age of 12 while living in Tasmania and started getting more serious about birding in 2016.</p>
				<p>Want to get in touch? Contact me via email: <a href='mailto:adam@rawcomposition.com'>adam@rawcomposition.com</a></p>
			</div>
			<Sidebar/>
		</div>
	)
}

export default About;
