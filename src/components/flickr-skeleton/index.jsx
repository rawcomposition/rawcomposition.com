import React from 'react';
import './styles.scss';

function Skeleton() {
	return (
		<article className='skeleton'>
			<div className='image'></div>
			<div className='content'>
				<div className='heading region'></div>
				<p className='region'></p>
				<p className='region'></p>
				<p className='region'></p>
			</div>
		</article>
	)
}

function FlickrSkeleton() {
	return (
		<div className='flickr-skeleton-wrapper'>
			<Skeleton/>
			<Skeleton/>
		</div>
	)
}

export default FlickrSkeleton;