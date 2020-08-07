import React, { useEffect, useState, useCallback } from 'react';
import Masonry from 'react-masonry-css'
import fetchJsonp from 'fetch-jsonp';
import FlickrItem from '../flickr-item';
import './styles.scss';

function FlickrStream() {
	const [page, setPage] = useState(1);
	const [photos, setPhotos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pages, setPages] = useState(0);

	const fetchPhotos = useCallback((newPage = 1) => {
		const api_key = process.env.REACT_APP_FLICKR_KEY;
		const per_page = 15;
		const url = `https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${api_key}&user_id=rawcomposition&per_page=${per_page}&page=${newPage}&format=json&extras=description`;
		setLoading(true);
		fetchJsonp(url, {
			jsonpCallbackFunction: 'jsonFlickrApi',
		  })
		.then(response => response.json())
		.then(data => {
			setPhotos(photos => ([...photos, ...data.photos.photo]));
			setPage(page =>(page + 1));
			setLoading(false);
			if(newPage === 1) {
				setPages(data.photos.pages);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		fetchPhotos();
	}, [fetchPhotos]);

	const masonryBreakpoints = {
		default: 2,
		992: 1,
	}

	const handleLoadMore = () => {
		fetchPhotos(page + 1);
	}
	
	return (
		<React.Fragment>
			<Masonry breakpointCols={masonryBreakpoints} className='flickr-list' columnClassName='flickr-list-column'>
				{photos.map(photo => {
					return <FlickrItem key={photo.id} item={photo}/>
				})}
			</Masonry>
			{(photos.length > 0 && pages !== page) &&
				<button className={ (loading ? 'disabled ' : '' ) + 'button load-more' } onClick={handleLoadMore}>{ loading ? 'loading...' : 'Load More' }</button>
			}
		</React.Fragment>
	)
}

export default FlickrStream;