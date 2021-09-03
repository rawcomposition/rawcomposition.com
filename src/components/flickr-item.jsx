import React from 'react';

function FlickrItem({item}) {

	const { farm, server, id, secret, title, o_width, o_height } = item;
	const url1x = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_z.jpg`;
	const url2x = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_b.jpg`;

	return (
		<article className='flickr-photo'>
			<a href={'https://www.flickr.com/photos/rawcomposition/' + id} target='_blank'>
				<img src={url1x} srcSet={`${url1x} 640w, ${url2x} 1024w`} width={o_width} height={o_height} alt='' loading='lazy'/>
			</a>
			<div className='content'>
				<h2>{title}</h2>
				<p>{item.description._content}</p>
			</div>
		</article>
	)
}

export default FlickrItem;