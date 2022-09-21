import * as React from "react";
import Lightbox from "components/Lightbox";
import Species from "components/LifelistSpecies";
import { forceCheck } from "react-lazyload";

function Lifelist({total, initialItems}) {
	const [allSpecies, setAllSpecies] = React.useState(initialItems);
	const [species, setSpecies] = React.useState(initialItems);
	const [sortByDate, setSortByDate] = React.useState(true);
	const [lightboxData, setLightboxData] = React.useState({
		imageId: "",
		caption: "",
		index: 0,
	});
	const searchRef = React.useRef();

	React.useEffect(() => {
		const url = sortByDate ? "/lifelist_date_sorted.json" : "/lifelist_taxon_sorted.json";
		fetch(url)
			.then(response => response.json())
			.then(data => {
				setSpecies(data);
				setAllSpecies(data);
				forceCheck();
			});
	}, [sortByDate]);

	const handleArrowPress = React.useCallback((directionInt) => {
		const index = lightboxData.index;
		const imageIndex = species[index].images.map(image => image.id).indexOf(lightboxData.imageId);
		if(species[index].images[imageIndex + directionInt]) {
			setLightboxData({
				...lightboxData,
				imageId: species[index].images[imageIndex + directionInt].id,
			});
		} else if(species[index + directionInt]) {
			let newImage = species[index + directionInt].images[0];
			const newSpecies = species[index + directionInt];
			if(directionInt === -1) {
				newImage = newSpecies.images[newSpecies.images.length -1];
			}
			setLightboxData({
				imageId: newImage.id,
				caption: newSpecies.name,
				index: index + directionInt,
			});
		}
	}, [species, lightboxData]);

	React.useEffect(() => {
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
			setSpecies(allSpecies.filter((item) => {
				return item.name.toLowerCase().includes(e.target.value.toLowerCase());
			}));
			
			setTimeout(function(){ forceCheck(); }, 500);
		} else {
			setSpecies(allSpecies);
		}
	}

	return (
		<>
				<h1 className="font-heading text-neutral-600 text-4xl mb-1">World Life List</h1>
				<div className="flex justify-between items-center">
					<span className="text-neutral-400 font-bold">Total species: {total}</span>
					<div className="flex justify-end gap-2">
						<button className={`font-bold text-lg text-neutral-600 px-4 ${!sortByDate ? "bg-neutral-200/90 rounded-full" : ""}`} onClick={(e) => handleSetSortBy(e, false)}>Taxonomic</button>
						<button className={`font-bold text-lg text-neutral-600 px-4 ${sortByDate ? "bg-neutral-200/90 rounded-full" : ""}`} onClick={(e) => handleSetSortBy(e, true)}>Latest</button>
						<span className="divider"></span>
						<div className="hidden items-center sm:flex">
							<button className="font-bold text-lg text-neutral-600 px-3 bg-neutral-200/90 rounded-full py-2" onClick={handleToggleSearch}><svg className="w-[14px]"  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg></button>
							<input type="text" ref={searchRef} onChange={filterResults} className="cursor-pointer w-0 transition-all duration-500 -ml-[25px] pl-[23px] bg-transparent rounded-r-full outline-none h-full border-l-0 border-2 border-neutral-200/90 focus:w-[180px] focus:-ml-[15px] focus:cursor-text" placeholder="Search..." />
						</div>
					</div>
				</div>
				<input type="text" onChange={filterResults} className="sm:hidden border px-2 py-1 rounded w-full my-6 focus:outline-1" placeholder="Search..." />
				<br/>
				{species.map((item, index) => <Species key={item.name.replace(/\W+/g, "-")} index={index} item={item} setLightboxData={setLightboxData}/>)}
			<Lightbox data={lightboxData} handleClose={handleCloseLightbox} />
		</>
	)
}

export default Lifelist;