import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import dayjs from "dayjs";
import Taxonomy from "../taxonomy.json";

const sensitiveDates = [
  { code: "lepchi", date: dayjs("2023-07-04").format() },
  { code: "gusgro", date: dayjs("2023-08-04").format() },
  { code: "yenpar1", date: dayjs("2023-05-02").format() },
  { code: "fepowl", date: dayjs("2017-06-21").format() },
  { code: "licpar", date: dayjs("2018-05-13").format() },
  { code: "purpar1", date: dayjs("2021-09-23").format() },
  { code: "gyrfal", date: dayjs("2021-05-07").format() },
  { code: "spoowl", date: dayjs("2020-05-15").format() },
  { code: "loeowl", date: dayjs("2017-09-17").format() },
  { code: "grgmac", date: dayjs("2020-03-03").format() },
  { code: "grgowl", date: dayjs("2018-09-02").format() },
  { code: "yelpar1", date: dayjs("2023-05-13").format() },
  { code: "mexpar1", date: dayjs("2023-10-08").format() },
  { code: "milmac", date: dayjs("2023-06-08").format() },
  { code: "grpchi", date: dayjs("2024-03-31").format() },
  { code: "lbsfin1", date: dayjs("2025-10-17").format() },
];

const COUNT = 1000;
const USER_AGENT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

(async () => {
  const getEbirdPhotos = async (cursor = "", results: any[] = []): Promise<any[]> => {
    const response = await fetch(
      `https://ebird.org/ml-search-api/v2/search?count=${COUNT}&unconfirmed=incl&sort=rating_rank_desc&mediaType=photo&birdOnly=true&userId=${process.env.EBIRD_USER_ID}&taxaLocale=en&initialCursorMark=${cursor}`,
      { headers: { "User-Agent": USER_AGENT } }
    );
    if (!response.ok) {
      throw `Error fetching eBird photos: HTTP ${response.status}`;
    }
    const json: any = await response.json();
    if (!Array.isArray(json)) {
      throw "Error fetching eBird photos";
    }
    const items = [...results, ...json];
    const nextCursor = json.length ? json[json.length - 1].cursorMark : null;
    if (json.length < COUNT || !nextCursor) {
      return items;
    }
    return await getEbirdPhotos(nextCursor, items);
  };

  console.log("Fetching photos from eBird...");
  const photos = await getEbirdPhotos();

  const filteredPhotos = photos.filter((photo) => photo.exoticCategory !== "escapee");

  const mlSpeciesNames: any = {};

  filteredPhotos.forEach((row) => {
    mlSpeciesNames[row.assetId] = row.taxonomy?.comName;
  });

  type Species = {
    [key: string]: {
      id: number;
      width: number;
      height: number;
      name: string;
      code: string;
      family: string;
      date: string;
      checklist_id: string;
    }[];
  };

  let species: Species = {};
  filteredPhotos.forEach((row) => {
    const commonName = row.taxonomy?.comName;
    const reportAs = row.taxonomy?.reportAs;
    if (!commonName) return;
    const taxon = Taxonomy.find((it) => it.code === reportAs);
    if (!taxon) return;
    if (!reportAs || commonName.includes("/") || commonName.includes("hybrid") || commonName.includes("sp.")) {
      return;
    }

    if (!species[reportAs]) {
      species[reportAs] = [];
    }

    species[reportAs].push({
      id: row.assetId,
      width: row.width,
      height: row.height,
      name: commonName,
      code: reportAs,
      family: taxon.family || "Unknown",
      date: row.obsDt
        ? dayjs(row.obsDt).format()
        : sensitiveDates.find((it) => it.code === reportAs)?.date || dayjs("1/1/2000").format(),
      checklist_id: row.ebirdChecklistId,
    });
  });

  const liferPhotos = Object.values(species).map((group) => {
    const bestPhoto = group[0];
    const date_sorted_group = group.slice().sort((a, b) => a.date.localeCompare(b.date));
    const first_date = date_sorted_group[0].date;
    return {
      name: bestPhoto.name.replace(/ *\([^)]*\) */g, ""),
      code: bestPhoto.code,
      count: group.length,
      date: first_date,
      year: dayjs(first_date).format("YYYY"),
      family: bestPhoto.family,
      img: bestPhoto.id,
      w: bestPhoto.width,
      h: bestPhoto.height,
    };
  });

  type DateGroupedLiferPhotos = {
    date: string;
    year: string;
    species: {
      name: string;
      code: string;
      count: number;
      img: number;
      w: number;
      h: number;
    }[];
  }[];

  const dateGroupedLiferPhotos: DateGroupedLiferPhotos = [];
  liferPhotos.forEach(({ family, date, year, ...item }) => {
    const existingGroup = dateGroupedLiferPhotos.find((it) => it.date === date);
    if (existingGroup) {
      existingGroup.species.push(item);
    } else {
      dateGroupedLiferPhotos.push({
        date,
        year,
        species: [item],
      });
    }
  });

  type FamilyGroupedLiferPhotos = {
    family: string;
    species: {
      name: string;
      date: string;
      year: string;
      img: number;
      w: number;
      h: number;
    }[];
  }[];

  const familyGroupedLiferPhotos: FamilyGroupedLiferPhotos = [];
  liferPhotos.forEach((photo) => {
    const existingGroup = familyGroupedLiferPhotos.find((it) => it.family === photo.family);
    if (existingGroup) {
      existingGroup.species.push(photo);
    } else {
      familyGroupedLiferPhotos.push({
        family: photo.family,
        species: [photo],
      });
    }
  });

  const cleanData = (data: any[]) => {
    return data.map(({ date, ...row }) => ({ ...row, date: dayjs(date).format("MMMM D") }));
  };

  console.log("Writing eBird photos to JSON file...");
  const years = [...new Set(dateGroupedLiferPhotos.map((s) => s.year))]
    .filter((year) => year !== "Invalid Date")
    .sort((a, b) => b.localeCompare(a));
  years.forEach((year) => {
    const year_sorted_species = dateGroupedLiferPhotos
      .filter((s) => s.year === year)
      .sort((a, b) => b.date.localeCompare(a.date));
    fs.writeFileSync(`./lifelist/${year}.json`, JSON.stringify(cleanData(year_sorted_species)));
  });
  fs.writeFileSync("./lifelist/by-family.json", JSON.stringify(familyGroupedLiferPhotos));
  fs.writeFileSync(
    "./lifelist/overview.json",
    JSON.stringify({
      years,
      total: liferPhotos.length,
    })
  );
  fs.writeFileSync("./lifelist/species-names.json", JSON.stringify(mlSpeciesNames));
  console.log("Done!");
})();
