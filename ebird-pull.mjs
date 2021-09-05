import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const getEbirdPhotos = async (cursor, results = []) => {
	const response = await fetch(`https://search.macaulaylibrary.org/api/v1/search?count=100&includeUnconfirmed=T&sort=upload_date_desc&mediaType=p&regionCode=&userId=${process.env.EBIRD_USER_ID}&taxaLocale=en&initialCursorMark=${cursor}`);
	const json = await response.json();
	if (!json.results) {
		throw "Error fetching eBird photos";
	}
	const items = [...results, ...json.results.content]
	if (!json.results.nextCursorMark) {
		return items;
	}
	return await getEbirdPhotos(json.results.nextCursorMark, items);
}

const getEbirdSpecies = async () => {
	const request = await fetch("https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json&cat=species&locale=en");
	const json = await request.json();
	const species = {}
	json.forEach(item => {
		species[item.speciesCode] = item.taxonOrder;
	});
	return species;
}

console.log("Fetching eBird taxonomy");
const taxonOrder = await getEbirdSpecies();
console.log("Fetching photos from eBird...");
const photos = await getEbirdPhotos();

let species = {}
photos.forEach((row) => {
	if (row.commonName.includes("/") || row.commonName.includes("hybrid") || row.commonName.includes("sp.")) {
		return;
	}
	if(!species[row.reportAs]) {
		species[row.reportAs] = [];
	}
	species[row.reportAs].push({
		id: parseInt(row.catalogId),
		width: row.width,
		height: row.height,
		name: row.commonName,
		code: row.reportAs,
		date: row.obsDttm !== "Unknown" ? new Date(row.obsDttm) : new Date("1/1/2000"),
		tax_sort: taxonOrder[row.reportAs],
		rating: Number(row.rating).toFixed(2),
		checklist_id: row.eBirdChecklistId,
	});
});

species = Object.values(species).map((group) => {
	const rating_sorted_group = group.slice().sort((a, b) => (a.rating < b.rating) ? 1 : -1).slice(0,3);
	const date_sorted_group = group.slice().sort((a,b) => (a.date - b.date));
	const first_date = date_sorted_group[0].date;
	return {
		name: rating_sorted_group[0].name.replace(/ *\([^)]*\) */g, ""),
		date: first_date,
		tax_sort: rating_sorted_group[0].tax_sort,
		images: rating_sorted_group.map(({id, width, height}) => {
			return {
				id,
				w: width,
				h: height,
			}
		})
	}
});

function finalizeSortedData(species) {
	return JSON.stringify(species.map(({name, images}) => ({ name, images })));
}

console.log("Writing eBird photos to JSON file...");
const date_sorted_species = species.slice().sort((a, b) => b.date - a.date);
fs.writeFileSync("./public/lifelist_date_sorted.json", finalizeSortedData(date_sorted_species));

const taxon_sorted_species = species.slice().sort((a, b) => a.tax_sort - b.tax_sort);
fs.writeFileSync("./public/lifelist_taxon_sorted.json", finalizeSortedData(taxon_sorted_species));