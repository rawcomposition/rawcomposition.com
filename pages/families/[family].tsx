import Head from "next/head";
import Header from "components/Header";
import { GetStaticProps, GetStaticPaths } from "next";
import families from "families.json";
import familySpecies from "lifelist/by-family.json";
import taxonomy from "taxonomy.json";
import Hummingbird from "icons/Hummingbird";
import Dove from "icons/Dove";
import Link from "next/link";
import CaretRight from "icons/CaretRight";

type Props = {
  family: string;
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

export default function LifelistPage({ family, items }: Props) {
  const withPhotos = items.filter((item) => !!item.img);
  return (
    <>
      <Head>
        <title>{`${family} | RawComposition.com`}</title>
      </Head>
      <Header noMargin />
      <div className="bg-neutral-800/90 p-2 mb-12">
        <div className="container text-gray-400 text-xs sm:text-sm">
          <Link href="/families" className="text-gray-200">
            Families
          </Link>
          <CaretRight className="mx-2" />
          {family}
        </div>
      </div>
      <div className="container max-w-[1200px]">
        <div className="p-12 bg-white mb-4">
          <h1 className="text-4xl font-bold mb-4">{family}</h1>
          <p className="text-lg text-gray-500 mb-8">
            Photographed {withPhotos.length} of {items.length} species
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(({ code, name, img }) => (
              <a
                key={code}
                href={
                  img
                    ? `https://media.ebird.org/catalog?taxonCode=${code}&sort=rating_rank_desc&mediaType=photo&userId=${process.env.NEXT_PUBLIC_EBIRD_USER_ID}`
                    : `https://ebird.org/species/${code}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center rounded-md p-4"
              >
                {img ? (
                  <img
                    src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${img}/640`}
                    loading="lazy"
                    alt={name}
                    className="object-cover w-full h-[160px] rounded-lg mb-2"
                  />
                ) : family === "Hummingbirds" ? (
                  <Hummingbird className="w-full h-[160px] rounded-lg mb-2 bg-gray-200 p-4 text-gray-300" />
                ) : (
                  <Dove className="w-full h-[160px] rounded-lg mb-2 bg-gray-200 p-8 text-gray-300" />
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = families.map(({ slug }) => ({
    params: { family: slug },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.family as string;
  const family = families.find((item) => item.slug === slug)?.name || "";
  const familySpeciesItems = familySpecies.find((item) => item.family === family)?.species ?? [];
  const filtered = taxonomy.filter((item) => item.family === family);
  const formatted = filtered.map(({ code, name }) => {
    const lifelistEntry = familySpeciesItems.find((it) => it.name === name);
    return {
      code,
      name,
      img: lifelistEntry?.img || null,
    };
  });

  return { props: { items: formatted, family } };
};
