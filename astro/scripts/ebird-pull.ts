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

  const filteredPhotos = photos.filter((photo) => photo.exoticCategory !== "escapee");

  const mlSpeciesNames: any = {};

  filteredPhotos.forEach((row) => {
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
  filteredPhotos.forEach((row) => {
    if (!row?.commonName) return;
    const taxon = Taxonomy.find((it) => it.code === row.reportAs);
    if (!taxon) return;
    if (
      !row?.reportAs ||
      row.commonName.includes("/") ||
      row.commonName.includes("hybrid") ||
      row.commonName.includes("sp.")
    ) {
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
      family: taxon.family || "Unknown",
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
