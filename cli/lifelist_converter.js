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
	let filteredResults = results.map( (row) => {
		return {
			id: parseInt(row.ml_catalog_number),
			name: row.common_name,
			species_code: row.report_as,
			category: row.taxon_category,
			country: row.country,
			state: row.state,
			tax_sort: Number(row.taxonomic_sort),
			rating: Number(row.average_community_rating).toFixed(2),
			checklist_id: row.ebird_checklist_id,
		}
	})
	.sort((a, b) => (a.tax_sort > b.tax_sort) ? 1 : -1);
	
	let species = {}
	filteredResults.forEach((row) => {
		if(!['Species', 'Group'].includes(row.category)) {
			return;
		}
		if(!species[row.species_code]) {
			species[row.species_code] = [];
		}
		species[row.species_code].push(row);
	});

	species = Object.values(species).map((group) => {
		const sorted_group =  group.sort((a, b) => (a.rating < b.rating) ? 1 : -1).slice(0,3);
		return {
			name: sorted_group[0].name.replace(/ *\([^)]*\) */g, ''),
			images: sorted_group.map(({id, name}) => {
				return id;
			})
		}
	});
	
	const data = JSON.stringify(species);
	fs.writeFileSync('../public/lifelist.json', data);
	console.log('Done');
}