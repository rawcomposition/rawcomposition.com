import React from "react";
import Head from "next/head";
import Header from "components/Header";
import Link from "next/link";
import families from "families.json";
import familySpecies from "lifelist/by-family.json";
import taxonomy from "taxonomy.json";
import { GetStaticProps } from "next";
import SortIcon from "icons/SortIcon";

type Props = {
  familyTotals: {
    name: string;
    slug: string;
    total: number;
    percent: number;
  }[];
};

export default function BirdFamilies({ familyTotals }: Props) {
  const [sortBy, setSortBy] = React.useState<"total" | "percent">("total");

  const sorted = familyTotals.sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <>
      <Head>
        <title>Bird Families | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container max-w-5xl">
        <div className="p-12 bg-white mb-4">
          <h1 className="text-4xl font-bold mb-8">Taxonomic Families</h1>
          <p className="text-lg text-gray-600 mb-4">View life list by family</p>

          <table className="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="bg-gray-50 px-6 py-3 text-left text-xs font-semibold text-gray-600">
                  Name
                </th>
                <th
                  scope="col"
                  className="bg-gray-50 px-6 py-3 text-right text-xs font-semibold text-gray-600 cursor-pointer"
                  onClick={() => setSortBy("total")}
                >
                  <span className="flex items-center gap-1 justify-end">
                    Total
                    {sortBy === "total" && <SortIcon className="text-[11px]" />}
                  </span>
                </th>
                <th
                  scope="col"
                  className="bg-gray-50 px-6 py-3 text-right text-xs font-semibold text-gray-600 cursor-pointer"
                  onClick={() => setSortBy("percent")}
                >
                  <span className="flex items-center gap-1 justify-end">
                    Percent
                    {sortBy === "percent" && <SortIcon className="text-[11px]" />}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sorted.map(({ slug, name, total, percent }) => (
                <tr>
                  <td className="px-6 py-3">
                    <Link href={`/families/${slug}`} className="text-lg text-orange mb-8">
                      {name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-right">{total}</td>
                  <td className="px-6 py-3 text-right">{percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const familyTotals = families.map(({ name, slug }) => {
    const photos = familySpecies.find((it) => it.family === name);
    const total = taxonomy.filter((it) => it.family === name).length;
    return {
      name,
      slug,
      total: photos?.species?.length ?? 0,
      percent: Math.round(((photos?.species?.length ?? 0) / total) * 100),
    };
  });

  const sorted = familyTotals.sort((a, b) => b.total - a.total);

  return { props: { familyTotals: sorted } };
};
