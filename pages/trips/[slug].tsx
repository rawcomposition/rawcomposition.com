import { GetStaticProps } from "next";
import Header from "components/Header";
import Head from "next/head";
import { getTrip, getPaths } from "helpers/trips";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import EbirdImage from "components/EbirdImage";

type Props = {
  source: any;
  matter: any;
};

const components = {
  EbirdImage: EbirdImage,
};

//Design ideas: https://wanderic.ancorathemes.com/enjoying-late-autumn-nature/

export default function Trip({ source, matter }: Props) {
  return (
    <>
      <Head>
        <title>RawComposition.com | Photography by Adam Jackson</title>
      </Head>
      <Header />
      <div className="container flex flex-col md:flex-row gap-8 max-w-[1200px]">
        <div className="flex-1 p-12 bg-white mb-4 prose prose-headings:font-heading prose-headings:text-neutral-600 prose-a:text-orange prose-img:mt-0 prose-hr:my-8 max-w-full">
          <h1 className="font-heading text-neutral-600 text-4xl mb-8">Fun Trip</h1>
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
