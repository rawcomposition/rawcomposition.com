import { GetStaticProps } from "next";
import Header from "components/Header";
import Head from "next/head";
import { getTrip, getPaths } from "helpers/trips";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import EbirdImage from "components/EbirdImage";
import { getEbirdImgUrl } from "helpers/ebird";
import TripMeta from "components/TripMeta";

type Props = {
  source: any;
  matter: any;
};

const components = {
  EbirdImage: EbirdImage,
};

//Design ideas: https://wanderic.ancorathemes.com/enjoying-late-autumn-nature/

export default function Trip({ source, matter }: Props) {
  const { title, month, length, species, lifers, isUS, featuredImg } = matter;
  const img = getEbirdImgUrl(featuredImg, 2400);

  return (
    <>
      <Head>
        <title>{title} | RawComposition.com</title>
      </Head>
      <Header />
      {featuredImg && <img src={img} alt="" className="w-full object-cover aspect-[2] -mt-12" />}
      <div className={`container flex flex-col md:flex-row gap-8 max-w-4xl ${featuredImg ? "-mt-16" : ""}`}>
        <div className="flex-1 p-4 sm:p-12 pt-3 sm:pt-10 bg-white mb-4 prose prose-headings:font-heading prose-headings:text-neutral-600 prose-a:text-orange prose-img:mt-0 prose-hr:my-8 max-w-full">
          <span className="text-xs font-medium px-1.5 py-[3px] rounded bg-blue-100 text-blue-800 opacity-70">
            {month}
          </span>
          <h1 className="font-heading text-neutral-600 text-4xl mb-4 mt-1">{title}</h1>
          <div className="flex gap-6 flex-wrap mb-10">
            <TripMeta {...{ length, species, lifers, isUS }} />
          </div>
          <MDXRemote {...source} components={components} />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const { content, data } = await getTrip(slug);
  if (!content) return { notFound: true };

  const mdxSource = await serialize(content, {
    scope: data,
  });

  return {
    props: {
      source: mdxSource,
      matter: data,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = await getPaths();
  return {
    paths,
    fallback: false,
  };
};
