import React from "react";
import LazyLoad from "react-lazyload";

function LifelistSpecies({index, item, setLightboxData}) {
	const handleImageClick = (e, image, name) => {
		e.preventDefault();
		setLightboxData({
			imageId: image,
			caption: name,
			index,
		});
	}
	return (
		<article className="lifelist-species">
			<h3>{item.name}</h3>
			<div className="images">
				{item.images.map(({id, w, h}) => {
					const image = <img width={w} height={h} src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${id}/640`} srcSet={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${id}/320 320w, https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${id}/480 480w, https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${id}/640 640w`} onClick={(e) => handleImageClick(e, id, item.name)}/>
					return (
						<a key={id} href={`https://macaulaylibrary.org/asset/${id}`} target="_blank">
							{index < 20 ? image : <LazyLoad debounce={50} offset={1200} once>{image}</LazyLoad>}
						</a>
					)
				})}
			</div>
		</article>
	)
}

export default React.memo(LifelistSpecies);