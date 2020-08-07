import React from 'react';
import './styles.scss';

function FlickrItem({item}) {

	const { farm, server, id, secret, title } = item;
	const url = `http://farm${farm}.staticflickr.com/${server}/${id}_${secret}_z.jpg`;

	return (
		<article className='flickr-photo'>
			<a href={'https://www.flickr.com/photos/rawcomposition/' + id} target='_blank'>
				<img src={url} alt=''/>
			</a>
			<div className='content'>
				<h2>{title}</h2>
				<p>{item.description._content}</p>
			</div>
		</article>
	)
}

export default FlickrItem;