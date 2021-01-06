import React, { useEffect, useState, useCallback, useRef } from 'react';
import Lightbox from '../../components/lightbox';
import Species from '../../components/species';
import { forceCheck } from 'react-lazyload';
import './styles.scss';

function Lifelist() {
	const [species, setSpecies] = useState([]);
	const [filteredSpecies, setFilteredSpecies] = useState([]);
	const [sortByDate, setSortByDate] = useState(true);
	const [lightboxData, setLightboxData] = useState({
		imageId: '',
		caption: '',
		index: 0,
	});
	const searchRef = useRef();

	useEffect(() => {
		const url = sortByDate ? '/lifelist_date_sorted.json' : '/lifelist_taxon_sorted.json';
		fetch(url)
			.then(response => response.json())
			.then(data => {
				setSpecies(data);
				forceCheck();
			});
	}, [sortByDate]);

	const handleArrowPress = useCallback((directionInt) => {
		const index = lightboxData.index;
		const imageIndex = species[index].images.indexOf(lightboxData.imageId);
		if(species[index].images[imageIndex + directionInt]) {
			setLightboxData({
				...lightboxData,
				imageId: species[index].images[imageIndex + directionInt],
			});
		} else if(species[index + directionInt]) {
			let newImage = species[index + directionInt].images[0];
			const newSpecies = species[index + directionInt];
			if(directionInt === -1) {
				newImage = newSpecies.images[newSpecies.images.length -1];
			}
			setLightboxData({
				imageId: newImage,
				caption: newSpecies.name,
				index: index + directionInt,
			});
		}
	}, [species, lightboxData]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			const {keyCode} = e;
			if(keyCode === 39) { //Right arrow key
				handleArrowPress(+1);
			} else if (keyCode === 37) { //Left arrow key
				handleArrowPress(-1);
			}
		}
		window.addEventListener("keyup", handleKeyDown);
		return () => {
			window.removeEventListener("keyup", handleKeyDown);
		}
	}, [handleArrowPress]);

	const handleCloseLightbox = () => {
		setLightboxData({});
	}

	const handleSetSortBy = (e, value) => {
		e.preventDefault();
		setSortByDate(value);
	}

	const handleToggleSearch = () => {
		searchRef.current.focus();
	}

	const filterResults = (e) => {
		if (e.target.value.length > 2) {
			setFilteredSpecies(species.filter((item) => {
				return item.name.toLowerCase().includes(e.target.value.toLowerCase());
			}));
			
			setTimeout(function(){ forceCheck(); }, 500);
		} else {
			setFilteredSpecies([]);
		}
	}

	const results = filteredSpecies.length > 0 ? filteredSpecies : species;

	return (
		<div className='container page-wrapper'>
			<div className="page content lifelist">
				<h1>World Life List</h1>
				<div className='actions'>
					<span className='species-total'>Total species: {species.length}</span>
					<div>
						<button className={!sortByDate ? 'active' : ''} onClick={(e) => handleSetSortBy(e, false)}>Taxonomic</button>
						<button className={sortByDate ? 'active' : ''} onClick={(e) => handleSetSortBy(e, true)}>Latest</button>
						<span className='divider'></span>
						<button className='search-toggle active' onClick={handleToggleSearch}><svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg></button>
						<input type='text' ref={searchRef} onChange={filterResults} className='inline-lifelist-search' placeholder='Search...'></input>
					</div>
				</div>
				<input type='text' onChange={filterResults} className='lifelist-search' placeholder='Search...'></input>
				<br/>

				{results.map((item, index) => (
					<Species key={item.name.replace(/\W+/g, " ")} index={index} item={item} setLightboxData={setLightboxData}/>
				))}
			</div>
			<Lightbox data={lightboxData} handleClose={handleCloseLightbox} />
		</div>
	)
}

export default Lifelist;