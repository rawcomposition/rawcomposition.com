import fs from "fs";
import os from "os";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Parses the personal eBird export (MyEBirdData.csv) into reported (not just photographed)
// stats: total species, new lifers per year, and species per country. Species only —
// subspecies/forms roll up to the parent species; spuhs, slashes, hybrids, and domestics
// are excluded. Roll-ups use the live eBird taxonomy since the CSV has no category column.

const csvPath = process.argv[2] || path.join(os.homedir(), "Downloads", "MyEBirdData.csv");

const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
  }
  return rows;
};

(async () => {
  console.log("Fetching full taxonomy from eBird...");
  const response = await fetch(
    `https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json&locale=en&key=${process.env.EBIRD_API_KEY}`
  );
  const taxonomy: any[] = await response.json();
  if (!Array.isArray(taxonomy)) {
    throw "Error fetching taxonomy";
  }

  const bySciName = new Map(taxonomy.map((it) => [it.sciName, it]));
  const byCode = new Map(taxonomy.map((it) => [it.speciesCode, it]));

  // Maps a CSV row's scientific name to its parent species, or null if not countable
  const resolveSpecies = (sciName: string) => {
    let taxon = bySciName.get(sciName);
    if (!taxon) return null;
    if (["spuh", "slash", "hybrid", "domestic"].includes(taxon.category)) return null;
    if (taxon.category !== "species" && taxon.reportAs) {
      taxon = byCode.get(taxon.reportAs);
    }
    if (!taxon || taxon.category !== "species") return null;
    return taxon;
  };

  console.log(`Parsing ${csvPath}...`);
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  const header = rows[0];
  const sciNameCol = header.indexOf("Scientific Name");
  const regionCol = header.indexOf("State/Province");
  const dateCol = header.indexOf("Date");
  if (sciNameCol === -1 || regionCol === -1 || dateCol === -1) {
    throw "Unexpected CSV format";
  }

  const firstDates = new Map<string, string>();
  const countrySpecies = new Map<string, Set<string>>();
  const unmatched = new Set<string>();

  rows.slice(1).forEach((row) => {
    const taxon = resolveSpecies(row[sciNameCol]);
    if (!taxon) {
      if (bySciName.get(row[sciNameCol]) === undefined) unmatched.add(row[sciNameCol]);
      return;
    }
    const code = taxon.speciesCode;
    const date = row[dateCol];
    const country = row[regionCol]?.split("-")[0];

    const existing = firstDates.get(code);
    if (!existing || date < existing) firstDates.set(code, date);

    if (country) {
      if (!countrySpecies.has(country)) countrySpecies.set(country, new Set());
      countrySpecies.get(country)!.add(code);
    }
  });

  if (unmatched.size) {
    console.warn(`Warning: ${unmatched.size} scientific names not found in taxonomy (skipped):`);
    unmatched.forEach((name) => console.warn(`  ${name}`));
  }

  const yearCounts = new Map<string, number>();
  firstDates.forEach((date) => {
    const year = date.slice(0, 4);
    yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
  });

  const stats = {
    total: firstDates.size,
    yearLifers: [...yearCounts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, count]) => ({ year, count })),
    countries: [...countrySpecies.entries()]
      .map(([code, species]) => ({ code, count: species.size }))
      .sort((a, b) => b.count - a.count),
    speciesCodes: [...firstDates.keys()].sort(),
  };

  fs.writeFileSync("./lifelist/reported-stats.json", JSON.stringify(stats, null, 2));
  console.log(
    `Done: ${stats.total} species, ${stats.countries.length} countries, ${stats.yearLifers.length} years`
  );
})();
