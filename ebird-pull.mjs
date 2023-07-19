import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import dayjs from "dayjs";

const sensitiveDates = [
  { code: "lepchi", date: new Date("4/7/2023") },
  { code: "gusgro", date: new Date("4/8/2023") },
  { code: "yenpar1", date: new Date("2/5/2023") },
  { code: "fepowl", date: new Date("6/21/2017") },
  { code: "licpar", date: new Date("13/5/2018") },
  { code: "purpar1", date: new Date("23/9/2021") },
  { code: "gyrfal", date: new Date("7/5/2021") },
  { code: "spoowl", date: new Date("15/5/2020") },
  { code: "loeowl", date: new Date("17/9/2017") },
  { code: "grgmac", date: new Date("3/3/2020") },
  { code: "grgowl", date: new Date("2/9/2018") },
  { code: "yelpar1", date: new Date("13/5/2023") },
];

const getEbirdPhotos = async (cursor, results = []) => {
  const response = await fetch(
    `https://search.macaulaylibrary.org/api/v1/search?count=100&includeUnconfirmed=T&sort=upload_date_desc&mediaType=p&regionCode=&userId=${process.env.NEXT_PUBLIC_EBIRD_USER_ID}&taxaLocale=en&initialCursorMark=${cursor}`
  );
  const json = await response.json();
  if (!json.results) {
    throw "Error fetching eBird photos";
  }
  const items = [...results, ...json.results.content];
  if (!json.results.nextCursorMark) {
    return items;
  }
  return await getEbirdPhotos(json.results.nextCursorMark, items);
};

console.log("Fetching photos from eBird...");
const photos = await getEbirdPhotos();

let species = {};
photos.forEach((row) => {
  if (row.commonName.includes("/") || row.commonName.includes("hybrid") || row.commonName.includes("sp.")) {
    return;
  }
  if (!species[row.reportAs]) {
    species[row.reportAs] = [];
  }
  species[row.reportAs].push({
    id: parseInt(row.catalogId),
    width: row.width,
    height: row.height,
    name: row.commonName,
    code: row.reportAs,
    date:
      row.obsDttm !== "Unknown"
        ? new Date(row.obsDttm)
        : sensitiveDates.find((it) => it.code === row.reportAs)?.date || new Date("1/1/2000"),
    rating: Number(row.rating).toFixed(2),
    checklist_id: row.eBirdChecklistId,
  });
});

species = Object.values(species).map((group) => {
  const rating_sorted_group = group
    .slice()
    .sort((a, b) => (a.rating < b.rating ? 1 : -1))
    .slice(0, 3);
  const date_sorted_group = group.slice().sort((a, b) => a.date - b.date);
  const first_date = date_sorted_group[0].date;
  return {
    name: rating_sorted_group[0].name.replace(/ *\([^)]*\) */g, ""),
    date: first_date,
    year: dayjs(first_date).format("YYYY"),
    images: rating_sorted_group.map(({ id, width, height }) => {
      return {
        id,
        w: width,
        h: height,
      };
    }),
  };
});

function finalizeSortedData(species) {
  return JSON.stringify(species.map(({ name, images, date }) => ({ name, images, date: dayjs(date).format("MMM D") })));
}

console.log("Writing eBird photos to JSON file...");
const years = [...new Set(species.map((s) => s.year))].filter((year) => year !== "Invalid Date").sort((a, b) => b - a);
years.forEach((year) => {
  const year_sorted_species = species.filter((s) => s.year === year).sort((a, b) => b.date - a.date);
  fs.writeFileSync(`./lifelist/${year}.json`, finalizeSortedData(year_sorted_species));
});
fs.writeFileSync(
  `./lifelist/overview.json`,
  JSON.stringify({
    years,
    total: species.length,
  })
);
