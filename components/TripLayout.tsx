import Header from "components/Header";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
};

export default function Trip({ children }: Props) {
  return (
    <>
      <Head>
        <title>RawComposition.com | Photography by Adam Jackson</title>
      </Head>
      <Header />
      <div className="container flex flex-col md:flex-row gap-8 max-w-[1200px]">
        <div className="flex-1 p-12 bg-white mb-4 prose prose-headings:font-heading prose-headings:text-neutral-600 prose-a:text-orange prose-img:mt-0 prose-hr:my-8 max-w-full">
          <h1 className="font-heading text-neutral-600 text-4xl mb-8">Fun Trip</h1>
          {children}
        </div>
      </div>
    </>
  );
}
