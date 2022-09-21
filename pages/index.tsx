import { GetStaticProps } from "next";
import { FlickrPhoto, Country } from "lib/types";
import FlickrItem from "components/FlickrItem";
import FlickrMore from "components/FlickrMore";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import { getPhotos } from "helpers/flickr";
import Head from "next/head";
import { getCountryData } from "helpers/ebird";

type Props = {
  photos: FlickrPhoto[];
  countryData: Country[];
};

export default function Home({ photos, countryData }: Props) {
  return (
    <>
      <Head>
        <title>RawComposition.com | Photography by Adam Jackson</title>
      </Head>
      <Header />
      <div className="container flex flex-col md:flex-row gap-8 max-w-[1050px] items-start">
        <div className="flex-1">
          {photos.map((photo) => {
            return <FlickrItem key={photo.id} {...photo} />;
          })}
          <FlickrMore />
        </div>
        <Sidebar countryData={countryData} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await getPhotos();
  const photos = data.photo;
  const countryData = await getCountryData();
  return {
    props: { photos, countryData },
  };
};
