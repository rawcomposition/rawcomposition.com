import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  console.log("Fetching taxonomy from eBird...");
  const response = await fetch(
    `https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json&locale=en&cat=species&key=${process.env.EBIRD_API_KEY}`
  );
  const json: any = await response.json();
  if (!json) {
    throw "Error fetching taxonomy";
  }

  const formatted = json.map((row: any) => {
    return {
      code: row.speciesCode,
      name: row.comName,
      family: row.familyComName,
    };
  });

  const families: any = [];

  formatted.forEach((it: any) => {
    if (families.find((family: any) => family.name === it.family)) {
      return;
    }
    families.push({
      name: it.family,
      slug: it.family.toLowerCase().replaceAll(" ", "-").replaceAll("'", "").replaceAll(",", ""),
    });
  });

  fs.writeFileSync(`./taxonomy.json`, JSON.stringify(formatted, null, 2));
  fs.writeFileSync(`./families.json`, JSON.stringify(families, null, 2));
})();
