import { Trip } from "lib/types";
import Link from "next/link";
import { getEbirdImgUrl } from "helpers/ebird";
import TripMeta from "components/TripMeta";

function TripItem({ title, slug, length, month, species, lifers, isUS, subtitle, featuredImg: img }: Trip) {
  return (
    <article className="mb-8 flex-col lg:flex-row flex">
      <Link href={`/trips/${slug}`}>
        <picture>
          <source media="(max-width: 1024px)" srcSet={getEbirdImgUrl(img, 900)} />
          <img
            className="w-full lg:w-[220px] aspect-[1.6] lg:aspect-auto lg:h-[220px] object-cover"
            src={getEbirdImgUrl(img, 480)}
            alt=""
            loading="lazy"
          />
        </picture>
      </Link>
      <div className="bg-white px-10 pb-8 pt-6 flex-1">
        {month && (
          <span className="text-xs font-medium px-1.5 py-[3px] rounded bg-blue-100 text-blue-800 opacity-70">
            {month}
          </span>
        )}
        <Link href={`/trips/${slug}`}>
          <h2 className="text-2xl font-bold mb-4 mt-2.5 font-heading text-gray-700">{title}</h2>
        </Link>
        <Link href={`/trips/${slug}`} className="flex gap-6 gap-y-3 flex-wrap">
          <TripMeta {...{ length, species, lifers, isUS, subtitle }} />
        </Link>
        <p className="text-sm text-neutral-500"></p>
      </div>
    </article>
  );
}

export default TripItem;
