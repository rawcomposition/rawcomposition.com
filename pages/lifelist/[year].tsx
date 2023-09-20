import Head from "next/head";
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

  const total = data.reduce((acc, item) => acc + item.species.length, 0);
  console.log(data);

  return (
    <>
      <Head>
        <title>World Life List | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container max-w-[1200px]">
        <h1 className="font-heading text-neutral-600 text-4xl mb-1">World Life List</h1>
        <div className="flex gap-4 text-sm">
          {overview.years.map((y) =>
            y === year ? (
              <span key={y} className="text-neutral-500">
                {y}
              </span>
            ) : (
              <Link key={y} href={`/lifelist/${y}`} className="text-[#f4793d] font-bold">
                {y}
              </Link>
            )
          )}
        </div>
        <p className="text-sm text-neutral-400 font-bold mt-1">
          Showing {total} lifers from {year}
        </p>
        <br />
        {data.map((item) => (
          <div className="mb-10" key={item.date}>
            <h2 className="font-bold text-sm font-heading mb-5 bg-sky-600 rounded-full px-4 py-1.5 text-white w-auto inline-block">
              {item.date}
            </h2>
            <div className="grid sm:grid-cols-3 gap-10 items-start">
              {item.species.map(({ name, img, w, h }) => {
                return (
                  <a
                    key={img}
                    href={`https://macaulaylibrary.org/asset/${img}`}
                    target="_blank"
                    className="block bg-white"
                  >
                    <img
                      width={w}
                      height={h}
                      src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${img}/640`}
                      className="w-full"
                      loading="lazy"
                    />
                    <div className="px-8 py-6">
                      <h3 className="text-neutral-600 font-bold font-heading">{name}</h3>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex justify-center items-center gap-4">
          {prevYear && (
            <Link href={`/lifelist/${prevYear}`} className="bg-[#f4793d] text-white py-2 px-8 flex gap-2 items-center">
              <ArrowLeft />
              {prevYear}
            </Link>
          )}
          {nextYear && (
            <Link href={`/lifelist/${nextYear}`} className="bg-[#f4793d] text-white py-2 px-8 flex gap-2 items-center">
              {nextYear}
              <ArrowRight />
            </Link>
          )}
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
