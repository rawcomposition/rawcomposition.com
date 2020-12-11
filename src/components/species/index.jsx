import React from 'react';
import LazyLoad from 'react-lazyload';

function Species({index, item, setLightboxData}) {
	const handleImageClick = (e, image, name) => {
		e.preventDefault();
		setLightboxData({
			imageId: image,
			caption: name,
			index,
		});
	}
	return (
		<article className='lifelist-species'>
			<h3>{item.name}</h3>
			<div className='images'>
				{item.images.map((image) => (
					<a key={image} href={`https://macaulaylibrary.org/asset/${image}`} target='_blank'>
						<LazyLoad debounce={50} offset={400}>
							<img src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${image}/320`} onClick={(e) => handleImageClick(e, image, item.name)}/>
						</LazyLoad>	
					</a>
				))}
			</div>
		</article>
	)
}

export default React.memo(Species);