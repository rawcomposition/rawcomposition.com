import overview from "lifelist/overview.json";
import { getCountryName } from "helpers/ebird";
import CountryRow from "components/CountryRow";
import { Country } from "lib/types";
import Link from "next/link";

type Props = {
  countryData: Country[];
};

export default function Sidebar({ countryData }: Props) {
  const totalCount = overview.total;
  if (!countryData) return null;

  return (
    <div className="bg-white p-10 w-full md:w-[33%] text-sm mb-8">
      <div className="text-center mb-12">
        <img className="w-[150px] rounded-full inline-block" src="/avatar.jpg" alt="" />
        <div>
          <h4 className="text-[#636467] uppercase font-bold font-heading mb-2 mt-6">Adam Jackson</h4>
          <p className="text-[0.85rem] text-zinc-500/80">
            I'm a software developer that loves chasing rare birds around world. I'm on a quest to photograph{" "}
            <strong>5,000 species</strong> in my lifetime, about 1/2 of the world's species.
          </p>
        </div>
      </div>
      <h4 className="text-[#636467] uppercase font-bold font-heading mb-4">Birding Life List</h4>

      <div className="text-zinc-600">
        <ol className="bg-zebra">
          <CountryRow country="World" count={totalCount} link={`/lifelist/${overview.years[0]}`} />
          {countryData.map(({ code, count }) => (
            <CountryRow key={code} country={getCountryName(code)} count={count} />
          ))}
        </ol>
      </div>

      <h4 className="text-[#636467] uppercase font-bold font-heading mb-4 mt-12">Lists</h4>
      <ul className="space-y-2">
        <li>
          <Link href={`/lifelist/${overview.years[0]}`} className="text-orange">
            World Life List
          </Link>
        </li>
        <li>
          <Link href="/families" className="text-orange">
            Taxonomic Families
          </Link>
        </li>
      </ul>

      <h4 className="text-[#636467] uppercase font-bold font-heading mb-4 mt-12">Stuff I've Built</h4>
      <p className="text-zinc-600">
        Use{" "}
        <Link href="https://birdplan.app" className="text-orange font-bold" target="_blank">
          BirdPlan.app
        </Link>{" "}
        to plan your next birding adventure!
      </p>
    </div>
  );
}
