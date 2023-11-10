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

  return (
    <>
      <Head>
        <title>World Life List | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container max-w-[1200px]">
        <div className="bg-white p-10 mt-6 mb-5">
          <div className="flex gap-2 items-center">
            <h1 className="font-heading text-neutral-600 text-4xl mb-1">World Life List</h1>
            <span className="rounded-full bg-neutral-200 text-2xl px-4 py-1 text-neutral-500">{overview.total}</span>
          </div>

          <div className="flex gap-x-4 gap-y-1 text-md flex-wrap mb-2 mt-6">
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
          <p className="mt-2">
            <span className="font-bold text-sm text-neutral-500">
              {total} lifers in {year}
            </span>
          </p>
        </div>
        <br />
        {data.map((item) => (
          <div className="mb-10" key={item.date}>
            <div className="flex gap-3 items-center mb-10">
              <hr className="border-neutral-300 w-4" />
              <h2 className="font-bold text-sm font-heading bg-sky-600 rounded-full px-4 py-1.5 text-white w-auto inline-block">
                {item.date}
              </h2>
              <hr className="border-neutral-300 flex-grow" />
            </div>
            <div className="grid sm:grid-cols-3 gap-10 items-start">
              {item.species.map(({ name, code, count, img, w, h }) => {
                return (
                  <a
                    key={img}
                    href={`https://media.ebird.org/catalog?taxonCode=${code}&sort=rating_rank_desc&mediaType=photo&userId=${process.env.NEXT_PUBLIC_EBIRD_USER_ID}`}
                    target="_blank"
                    className="block bg-white relative"
                  >
                    <img
                      width={w}
                      height={h}
                      src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${img}/640`}
                      className="w-full"
                      loading="lazy"
                    />
                    {count > 1 && (
                      <span className="absolute top-2 right-2 bg-white/40 rounded px-2 py-0.5 text-sm text-neutral-600">
                        {count}
                      </span>
                    )}
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
