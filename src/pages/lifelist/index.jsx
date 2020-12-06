import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar';
import LazyLoad from 'react-lazyload';
import './styles.scss';

function Lifelist() {
	const [species, setSpecies] = useState([]);

	useEffect(() => {
		fetch('/lifelist.json')
			.then(response => response.json())
			.then(data => setSpecies(data));
	}, []);

	return (
		<div className='container page-wrapper'>
			<div className="page content">
				{species.map((item) => (
					<article className='lifelist-species'>
						<h3>{item.name}</h3>
						<div className='images'>
							{item.images.map((image) => (
								<a href={`https://macaulaylibrary.org/asset/${image}`} target='_blank'>
									<LazyLoad debounce={50} offset={400}>
										<img src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${image}/320`}/>
									</LazyLoad>	
								</a>
							))}
						</div>
					</article>
				))}
			</div>
			<Sidebar/>
		</div>
	)
}

export default Lifelist;