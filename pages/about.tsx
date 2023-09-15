import { GetStaticProps } from "next";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import Head from "next/head";
import { getCountryData } from "helpers/ebird";
import { Country } from "lib/types";
import Link from "next/link";
import overview from "lifelist/overview.json";

type Props = {
  countryData: Country[];
};

export default function About({ countryData }: Props) {
  return (
    <>
      <Head>
        <title>About | RawComposition.com</title>
      </Head>
      <Header />
      <div className="container flex flex-col md:flex-row gap-8 max-w-[1200px]">
        <div className="flex-1 p-12 bg-white mb-4 prose prose-headings:font-heading prose-headings:text-neutral-600 prose-a:text-orange prose-img:mt-0 prose-hr:my-8 max-w-full">
          <h1 className="font-heading text-neutral-600 text-4xl mb-8">G'day, mates 👋</h1>
          <img
            src="/me.jpg"
            alt="Photo of Adam Jackson and his wife"
            width="200"
            className="float-right p-2 border mb-4 ml-4"
          />
          <p>
            I'm a web developer that loves chasing rare birds around world. I developed an interest in bird photography
            at the age of 12 while living in Tasmania and started getting more serious about birding in 2016.
          </p>
          <p>
            Photography has alwasy been an important part of birding for me, so in order to record a species on my life
            list I like to make sure I have a picture (or at least a good audio recording). There's a few situations
            where that didn't happen, but most of the time it works out :)
          </p>
          <p>
            My goal is to photograph 5,000 species of birds in my lifetime, while keeping my birding adventures to a
            reasonable budget.
          </p>
          <p>
            <strong className="text-neutral-600">View my progress</strong>
            <br />
            <Link href={`/lifelist/${overview.years[0]}`}>World Life List</Link>
            <br />
            <a href="https://ebird.org/profile/NzMwMzI1/world" target="_blank">
              View my eBird profile
            </a>
          </p>
          <hr />
          <p>
            Want to get in touch? Contact me via email:{" "}
            <a href="mailto:adam@rawcomposition.com">adam@rawcomposition.com</a>
          </p>
        </div>
        <Sidebar countryData={countryData} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const countryData = await getCountryData();
  return {
    props: { countryData },
  };
};
