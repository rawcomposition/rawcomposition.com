import * as React from "react";
import { GetStaticProps } from "next";
import { Trip, Country } from "lib/types";
import { getCountryData } from "helpers/ebird";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import { getTrips } from "helpers/trips";
import Head from "next/head";
import Link from "next/link";

type Props = {
  trips: Trip[];
  countryData: Country[];
};

export default function Trips({ trips: initialTrips, countryData }: Props) {
  const [trips, setTrips] = React.useState(initialTrips);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips?page=${page + 1}`);
      const trips = await res.json();
      setTrips((current) => [...current, ...trips]);
      setPage((current) => current + 1);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>RawComposition.com | Photography by Adam Jackson</title>
      </Head>
      <Header />
      <div className="container flex flex-col md:flex-row gap-8 max-w-[1050px] items-start">
        <div className="flex-1">
          {trips.map(({ slug, title }) => {
            return (
              <article key={slug}>
                <h2>
                  <Link href={`/trips/${slug}`}>{title}</Link>
                </h2>
              </article>
            );
          })}
          <button
            disabled={loading}
            className="bg-[#f4793d] text-white py-2 px-8 mb-8 mx-auto block"
            onClick={loadMore}
          >
            {loading ? "loading..." : "Load More"}
          </button>
        </div>
        <Sidebar countryData={countryData} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const trips = await getTrips(1);
  const countryData = await getCountryData();
  return {
    props: { trips, countryData },
  };
};
