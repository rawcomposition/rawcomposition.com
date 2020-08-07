import React from 'react';
import Sidebar from '../../components/sidebar';
import FlickrStream from '../../components/flickr-stream';
import './styles.scss';

function Home() {
	return (
		<div className='container page-wrapper'>
			<div className="content">
				<FlickrStream/>
			</div>
			<Sidebar/>
		</div>
	)
}

export default Home;