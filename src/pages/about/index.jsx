import React from 'react';
import Sidebar from '../../components/sidebar';
import './styles.scss';

function About() {
	return (
		<div className='container page-wrapper'>
			<div className="page content">
				<img src='/me.jpg' alt='' className='bio-image'/>
				<p>I was first introduced to photography at the age of 12 when I was living on the island of Tasmania, Australia.  I continued to hone my skills in all different areas of photography, spending much time documenting the nature around me and many local events.</p>
				<p>Want to get in touch? Contact me via email: <a href='mailto:mail@rawcomposition.com'>mail@rawcomposition.com</a></p>
			</div>
			<Sidebar/>
		</div>
	)
}

export default About;