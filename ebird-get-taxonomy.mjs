import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

console.log("Fetching taxonomy from eBird...");
const response = await fetch(
  `https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json&locale=en&cat=species&key=${process.env.NEXT_PUBLIC_EBIRD_API}`
);
const json = await response.json();
if (!json) {
  throw "Error fetching taxonomy";
}

const formatted = json.map((row) => {
  return {
    code: row.speciesCode,
    name: row.comName,
    family: row.familyComName,
  };
});

fs.writeFileSync(`./taxonomy.json`, JSON.stringify(formatted, null, 2));
