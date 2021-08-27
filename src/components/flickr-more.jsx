import React, { useState } from 'react';
import FlickrItem from './flickr-item';
import { getPhotos } from "../helpers/flickr.js";

function FlickrMore() {
	const [state, setState] = useState({
		page: 1,
		photos: [],
		loading: false,
		pages: null,
	});

	const { page, photos, loading, pages } = state;

	const handleLoadMore = async (fetchPage) => {
		setState(state => ({...state, loading: true}));
		const data = await getPhotos(fetchPage);
		setState(state => ({
			page: state.page + 1,
			loading: false,
			pages: data.pages,
			photos: [...state.photos, ...data.photo],
		}));
	}
	
	return (
		<React.Fragment>
			<div className="flickr-list">
				{photos.map(photo => {
					return <FlickrItem key={photo.id} item={photo}/>
				})}
			</div>
			{(pages !== page) &&
				<button className={`${loading ? 'disabled' : ''} button load-more`} onClick={() => handleLoadMore(page + 1)}>{ loading ? 'loading...' : 'Load More' }</button>
			}
		</React.Fragment>
	)
}

export default FlickrMore;