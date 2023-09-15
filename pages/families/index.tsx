import Head from "next/head";
import Header from "components/Header";
import Link from "next/link";
import families from "families.json";
import familySpecies from "lifelist/by-family.json";
import { GetStaticProps } from "next";

type Props = {
  familyTotals: {
    name: string;
    slug: string;
    total: number;
  }[];
};

export default function BirdFamilies({ familyTotals }: Props) {
  return (
    <>
      <Head>
        <title>Bird Families | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container max-w-[1200px]">
        <div className="p-12 bg-white mb-4">
          <h1 className="text-4xl font-bold mb-8">Families</h1>
          <p className="text-lg text-gray-600 mb-4">View life list by family</p>
          <ul className="mb-4 list-disc list-inside space-y-1 text-gray-500">
            {familyTotals.map(({ slug, name, total }) => (
              <li key={slug}>
                <Link href={`/families/${slug}`} className="text-lg text-orange mb-8">
                  {name} <span className="text-gray-400">({total})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const familyTotals = families.map(({ name, slug }) => {
    const photos = familySpecies.find((it) => it.family === name);
    return {
      name,
      slug,
      total: photos?.species?.length ?? 0,
    };
  });

  const sorted = familyTotals.sort((a, b) => b.total - a.total);

  return { props: { familyTotals: sorted } };
};
