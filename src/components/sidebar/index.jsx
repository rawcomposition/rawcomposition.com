import React from 'react';
import './styles.scss';

function Sidebar() {
	return (
		<div className='sidebar'>
			<div className='bio'>
				<img className='avatar' src='/avatar.jpg' alt=''/>
				<div>
					<h4>Adam Jackson</h4>
					<p>I'm a web developer and biostatistics graduate student, but what really gives me a thrill is chasing rare birds around world. I developed an interest in bird photography at the age of 12 while living in Tasmania and started getting more serious about birding in 2016.</p>
				</div>
			</div>
			<h4>Elsewhere</h4>
			<a href='https://www.flickr.com/photos/rawcomposition/' target='_blank'>Follow me on Flickr</a><br/>
			<a href='https://ebird.org/profile/NzMwMzI1/world' target='_blank'>View my eBird profile</a>
		</div>
	)
}

export default Sidebar;