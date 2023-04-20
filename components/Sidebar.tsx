import overview from "lifelist/overview.json";
import { getCountryName } from "helpers/ebird";
import CountryRow from "components/CountryRow";
import { Country } from "lib/types";

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
            I'm a web developer that loves chasing rare birds around world. I developed an interest in bird photography
            at the age of 12 while living in Tasmania and started getting more serious about birding in 2016.
          </p>
        </div>
      </div>
      <h4 className="text-[#636467] uppercase font-bold font-heading mb-4">Birding Life List</h4>

      <details className="text-zinc-600">
        <summary className="relative marker-none">
          <ol className="bg-zebra">
            <CountryRow country="World" count={totalCount} link="/lifelist" />
            {countryData.slice(0, 5).map(({ code, count }) => (
              <CountryRow key={code} country={getCountryName(code)} count={count} />
            ))}
          </ol>
          <div className="text-center text-orange cursor-pointer absolute left-0 right-0 bottom-0 p-2 bg-gradient-to-t from-white to-transparent hide-on-open">
            View More
          </div>
        </summary>
        <ol className="bg-zebra">
          {countryData.slice(5).map(({ code, count }) => (
            <CountryRow key={code} country={getCountryName(code)} count={count} />
          ))}
        </ol>
      </details>
    </div>
  );
}
