import Head from "next/head";
import Lifelist from "components/Lifelist";
import overview from "lifelist/overview.json";
import Header from "components/Header";
import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs";
import { Species } from "lib/types";

type Props = {
  species: Species[];
  year: string;
};

export default function LifelistPage({ species, year }: Props) {
  return (
    <>
      <Head>
        <title>World Life List | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container max-w-[1200px]">
        <div className="p-12 bg-white mb-4">
          <Lifelist total={overview.total} species={species} year={year} />
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

  const speciesData = fs.readFileSync(`lifelist/${year}.json`, "utf8");
  const species = JSON.parse(speciesData);

  return { props: { species, year } };
};
