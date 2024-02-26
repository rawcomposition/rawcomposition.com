import { getEbirdImgUrl } from "helpers/ebird";
import ArrowRight from "icons/ArrowRight";
import CheckCircle from "icons/CheckCircle";
import SpeciesNames from "lifelist/species-names.json";

type Props = {
  id: string;
  text?: any;
  lifer?: boolean;
};

export default function Image({ id, text, lifer }: Props) {
  const url = getEbirdImgUrl(id, 1200);
  const formattedId = id.toLowerCase().replace("ml", "");
  const speciesName = (SpeciesNames as any)?.[formattedId] || "";
  return (
    <figure className="bg-gray-200">
      <img src={url} alt="" loading="lazy" className="w-full object-contain max-h-[600px]" />
      <figcaption className="text-sm text-gray-900 mt-0 px-4 py-3 relative">
        <strong>{speciesName}</strong>{" "}
        {lifer && (
          <span className="text-[12px] font-medium rounded bg-lime-700/10 px-1 text-lime-700 inline-flex items-center gap-1 align-bottom ml-2">
            <CheckCircle />
            Lifer
          </span>
        )}
        <a
          href={`https://macaulaylibrary.org/asset/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-4 no-underline !text-slate-600 inline-flex gap-1 items-center"
        >
          View on eBird
          <ArrowRight />
        </a>
        {text && (
          <>
            <br />
            <span className="inline-block mt-1">{text}</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
