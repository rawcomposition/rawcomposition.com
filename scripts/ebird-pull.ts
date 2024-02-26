import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import dayjs from "dayjs";
import Taxonomy from "../taxonomy.json";

const sensitiveDates = [
  { code: "lepchi", date: dayjs("4/7/2023").format() },
  { code: "gusgro", date: dayjs("4/8/2023").format() },
  { code: "yenpar1", date: dayjs("2/5/2023").format() },
  { code: "fepowl", date: dayjs("6/21/2017").format() },
  { code: "licpar", date: dayjs("13/5/2018").format() },
  { code: "purpar1", date: dayjs("23/9/2021").format() },
  { code: "gyrfal", date: dayjs("7/5/2021").format() },
  { code: "spoowl", date: dayjs("15/5/2020").format() },
  { code: "loeowl", date: dayjs("17/9/2017").format() },
  { code: "grgmac", date: dayjs("3/3/2020").format() },
  { code: "grgowl", date: dayjs("2/9/2018").format() },
  { code: "yelpar1", date: dayjs("5/13/2023").format() },
  { code: "mexpar1", date: dayjs("8/10/2023").format() },
  { code: "milmac", date: dayjs("8/6/2023").format() },
];

const beginYear = 2000;
const endYear = new Date().getFullYear();

(async () => {
  const getEbirdPhotos = async (cursor?: string, results = []): Promise<any[]> => {
    const response = await fetch(
      `https://search.macaulaylibrary.org/api/v1/search?count=100&includeUnconfirmed=T&sort=rating_rank_desc&mediaType=p&regionCode=&userId=${process.env.NEXT_PUBLIC_EBIRD_USER_ID}&taxaLocale=en&initialCursorMark=${cursor}&beginYear=${beginYear}&endYear=${endYear}`
    );
    const json: any = await response.json();
    if (!json.results) {
      throw "Error fetching eBird photos";
    }
    const items: any = [...results, ...json.results.content];
    if (!json.results.nextCursorMark) {
      return items;
    }
    return await getEbirdPhotos(json.results.nextCursorMark, items);
  };

  console.log("Fetching photos from eBird...");
  const photos = await getEbirdPhotos();

  const mlSpeciesNames: any = {};

  photos.forEach((row) => {
    mlSpeciesNames[row.catalogId] = row.commonName;
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
      family: Taxonomy.find((it) => it.code === row.reportAs)?.family || "Unknown",
      date:
        row.obsDttm !== "Unknown"
          ? dayjs(row.obsDttm).format()
          : sensitiveDates.find((it) => it.code === row.reportAs)?.date || dayjs("1/1/2000").format(),
      checklist_id: row.eBirdChecklistId,
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
