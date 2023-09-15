import Head from "next/head";
import Species from "components/LifelistSpecies";
import Link from "next/link";
import ArrowRight from "icons/ArrowRight";
import ArrowLeft from "icons/ArrowLeft";
import overview from "lifelist/overview.json";
import Header from "components/Header";
import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs";
import { SpeciesDate } from "lib/types";

type Props = {
  data: SpeciesDate[];
  year: string;
};

export default function LifelistPage({ data, year }: Props) {
  const yearIndex = overview.years.indexOf(year);
  const nextYear = overview.years[yearIndex - 1];
  const prevYear = overview.years[yearIndex + 1];

  return (
    <>
      <Head>
        <title>World Life List | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container max-w-[1200px]">
        <div className="p-12 bg-white mb-4">
          <h1 className="font-heading text-neutral-600 text-4xl mb-1">World Life List</h1>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400 font-bold">Showing lifers from {year}</span>
          </div>
          <br />
          {data.map((item, index) => (
            <Species key={item.date} index={index} item={item} />
          ))}
          <div className="flex justify-center items-center gap-4">
            {prevYear && (
              <Link
                href={`/lifelist/${prevYear}`}
                className="bg-[#f4793d] text-white py-2 px-8 flex gap-2 items-center"
              >
                <ArrowLeft />
                {prevYear}
              </Link>
            )}
            {nextYear && (
              <Link
                href={`/lifelist/${nextYear}`}
                className="bg-[#f4793d] text-white py-2 px-8 flex gap-2 items-center"
              >
                {nextYear}
                <ArrowRight />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = overview.years.map((year) => ({
    params: { year },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const year = params?.year as string;

  const data = fs.readFileSync(`lifelist/${year}.json`, "utf8");

  return { props: { data: JSON.parse(data), year } };
};
