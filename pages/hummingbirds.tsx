import Head from "next/head";
import Header from "components/Header";
import { GetStaticProps } from "next";
import Taxonomy from "../taxonomy.json";
import Photos from "lifelist/all.json";
import Hummingbird from "icons/Hummingbird";

type Props = {
  items: {
    code: string;
    name: string;
    img: {
      id: string;
      w: number;
      h: number;
    };
  }[];
};

export default function LifelistPage({ items }: Props) {
  const withPhotos = items.filter((item) => !!item.img);
  return (
    <>
      <Head>
        <title>Hummingbirds | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container max-w-[1200px]">
        <div className="p-12 bg-white mb-4">
          <h1 className="text-4xl font-bold mb-4">Hummingbirds</h1>
          <p className="text-lg text-gray-500 mb-8">
            Photographed {withPhotos.length} of {items.length} species
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(({ code, name, img }) => (
              <a
                key={code}
                href={`https://ebird.org/species/${code}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center rounded-md p-4"
              >
                {img ? (
                  <img
                    src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${img.id}/640`}
                    loading="lazy"
                    alt={name}
                    className="object-cover w-full h-[160px] rounded-lg mb-2"
                    width={img.w}
                    height={img.h}
                  />
                ) : (
                  <Hummingbird className="w-full h-[160px] rounded-lg mb-2 bg-gray-200 p-3 text-gray-300" />
                )}
                <span className="text-sm text-gray-500">{name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const filtered = Taxonomy.filter((item) => item.family === "Hummingbirds");
  const formatted = filtered.map(({ code, name }) => {
    const lifelistEntry = Photos.find((it) => it.name === name);
    return {
      code,
      name,
      img: lifelistEntry?.images?.[0] || null,
    };
  });

  return { props: { items: formatted } };
};
