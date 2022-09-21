import Head from "next/head";
import Lifelist from "components/Lifelist";
import speciesPhotos from "public/lifelist_date_sorted.json";
import Header from "components/Header";

export default function LifelistPage() {
  return (
    <>
      <Head>
        <title>World Life List | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container max-w-[1200px]">
        <div className="p-12 bg-white mb-4">
          <Lifelist total={speciesPhotos.length} initialItems={speciesPhotos.slice(0, 20)} />
        </div>
      </div>
    </>
  );
}
