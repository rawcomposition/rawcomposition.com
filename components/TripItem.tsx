import { Trip } from "lib/types";
import Link from "next/link";
import { getEbirdImgUrl } from "helpers/ebird";
import Feather from "icons/Feather";
import Clock from "icons/Clock";
import CheckCircle from "icons/CheckCircle";

function TripItem({ title, slug, length, month, species, lifers, isUS, featuredImg }: Trip) {
  const url1x = getEbirdImgUrl(featuredImg, 320);
  const url2x = getEbirdImgUrl(featuredImg, 480);

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
      <div className="bg-white px-10 pb-8 pt-6 flex-1">
        {month && (
          <span className="text-xs font-medium px-1.5 py-[3px] rounded bg-blue-100 text-blue-800 opacity-70">
            {month}
          </span>
        )}
        <h2 className="text-2xl font-bold mb-4 mt-2.5 font-heading text-gray-700">{title}</h2>
        <div className="flex gap-6 flex-wrap">
          {length && (
            <span className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <Clock className="text-sm text-gray-500" /> {length}
            </span>
          )}
          {species && (
            <span className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <Feather className="text-sm text-gray-500" /> {species} species
            </span>
          )}
          {lifers && (
            <span className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <CheckCircle className="text-sm text-gray-500" /> {lifers} lifers
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-500"></p>
      </div>
    </article>
  );
}

export default TripItem;
