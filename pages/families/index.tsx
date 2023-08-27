import Head from "next/head";
import Header from "components/Header";
import Families from "lifelist/families.json";
import Link from "next/link";

export default function BirdFamilies() {
  return (
    <>
      <Head>
        <title>Bird Families | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container max-w-[1200px]">
        <div className="p-12 bg-white mb-4">
          <h1 className="text-4xl font-bold mb-8">Families</h1>
          <p className="text-lg text-gray-600 mb-4">View life list by family (more coming soon)</p>
          <ul className="mb-4 list-disc list-inside space-y-1 text-gray-500">
            {Families.map(({ slug, name }) => (
              <li key={slug}>
                <Link href={`/families/${slug}`} className="text-lg text-orange mb-8">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
