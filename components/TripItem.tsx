import { Trip } from "lib/types";
import Link from "next/link";
import { getEbirdImgUrl } from "helpers/ebird";

function FlickrItem({ title, slug, featuredImg }: Trip) {
  const url1x = getEbirdImgUrl(featuredImg, 640);
  const url2x = getEbirdImgUrl(featuredImg, 1200);

  return (
    <article className="mb-8 flex">
      <Link href={`/trips/${slug}`}>
        <img
          className="w-[220px] h-[220px] object-cover"
          src={url1x}
          srcSet={`${url1x} 640w, ${url2x} 1024w`}
          alt=""
          loading="lazy"
        />
      </Link>
      <div className="bg-white px-10 py-8 flex-1">
        <h2 className="font-bold mb-4 font-heading text-gray-700">{title}</h2>
        <p className="text-sm text-neutral-500"></p>
      </div>
    </article>
  );
}

export default FlickrItem;
