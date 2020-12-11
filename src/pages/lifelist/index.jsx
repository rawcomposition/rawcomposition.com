import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/sidebar';
import Lightbox from '../../components/lightbox';
import Species from '../../components/species';
import { forceCheck } from 'react-lazyload';
import './styles.scss';

function Lifelist() {
	const [species, setSpecies] = useState([]);
	const [sortByDate, setSortByDate] = useState(true);
	const [lightboxData, setLightboxData] = useState({
		imageId: '',
		caption: '',
		index: 0,
	});

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

	return (
		<div className='container page-wrapper'>
			<div className="page content lifelist">
				<h1>World Life List</h1>
				<div className='actions'>
					<span className='species-total'>Total species: {species.length}</span>
					<div class='sort-buttons'>
						<button className={!sortByDate ? 'active' : ''} onClick={(e) => handleSetSortBy(e, false)}>Taxonomic</button>
						<button className={sortByDate ? 'active' : ''} onClick={(e) => handleSetSortBy(e, true)}>Latest</button>
					</div>
				</div>
				<br/>

				{species.map((item, index) => (
					<Species key={item.name.replace(/\W+/g, " ")} index={index} item={item} setLightboxData={setLightboxData}/>
				))}
			</div>
			<Lightbox data={lightboxData} handleClose={handleCloseLightbox} />
		</div>
	)
}

export default Lifelist;