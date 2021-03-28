const csv = require('csv-parser');
const stripBom = require('strip-bom-stream');
const fs = require('fs');

const results = [];
fs.createReadStream('./ml.csv')
	.pipe(stripBom())
	.pipe(csv({
		mapHeaders: ({ header, index }) => header.toLowerCase().replace(/ /g,"_")
	}))
	.on('data', (data) => results.push(data))
	.on('end', () => {
		processResults(results);
	}
);

function processResults(results) {
	let restructuredResults = results.map( (row) => {
		return {
			id: parseInt(row.ml_catalog_number),
			name: row.common_name,
			species_code: row.report_as,
			date: row.date ? new Date(row.date) : new Date('1/1/2000'),
			category: row.taxon_category,
			country: row.country,
			state: row.state,
			tax_sort: Number(row.taxonomic_sort),
			rating: Number(row.average_community_rating).toFixed(2),
			checklist_id: row.ebird_checklist_id,
			format: row.format,
		}
	});
	
	let species = {}
	restructuredResults.forEach((row) => {
		const countableDomestics = ['rocpig'];
		if(!['Species', 'Group', 'Form'].includes(row.category) && !countableDomestics.includes(row.species_code)) {
			return;
		}
		if(row.format !== "Photo") {
			return;
		}
		if(!species[row.species_code]) {
			species[row.species_code] = [];
		}
		species[row.species_code].push(row);
	});

	species = Object.values(species).map((group) => {
		const rating_sorted_group = group.slice().sort((a, b) => (a.rating < b.rating) ? 1 : -1).slice(0,3);
		const date_sorted_group = group.slice().sort(function(a,b) {
			return a.date - b.date;
		});
		const first_date = date_sorted_group[0].date;
		return {
			name: rating_sorted_group[0].name.replace(/ *\([^)]*\) */g, ''),
			date: first_date,
			tax_sort: rating_sorted_group[0].tax_sort,
			images: rating_sorted_group.map(({id, name}) => {
				return id;
			})
		}
	});
	
	const date_sorted_species = species.slice().sort((a, b) => b.date - a.date);
	fs.writeFileSync('../public/lifelist_date_sorted.json', finalizeSortedData(date_sorted_species));

	const taxon_sorted_species = species.slice().sort((a, b) => a.tax_sort - b.tax_sort);
	fs.writeFileSync('../public/lifelist_taxon_sorted.json', finalizeSortedData(taxon_sorted_species));

	console.log('Done');
}

function finalizeSortedData(species) {
	const cleaned = species.map(({name, images}) => {
		return {
			name,
			images
		}
	});

	return JSON.stringify(cleaned);
}