import Feather from "icons/Feather";
import Clock from "icons/Clock";
import CheckCircle from "icons/CheckCircle";

type Props = {
  length?: string;
  species?: number;
  lifers?: number;
  isUS?: boolean;
  ebirdLink?: string;
  subtitle?: string;
};

function TripItem({ length, species, lifers, isUS, ebirdLink, subtitle }: Props) {
  return (
    <>
      {subtitle && <p className="text-gray-500 w-full -mt-3">{subtitle}</p>}
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
          <CheckCircle className="text-sm text-gray-500" /> {lifers} {isUS ? "US lifers" : "lifers"}
        </span>
      )}
      {ebirdLink && (
        <a
          href={ebirdLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center !text-gray-500 whitespace-nowrap no-underline bg-gray-100 text-[13px] leading-3 px-2.5 py-[2px] rounded"
        >
          View on <img src="/ebird.png" className="h-[18px] -mt-[1px] -mr-1.5 inline-block mb-0" alt="eBird" />
        </a>
      )}
    </>
  );
}

export default TripItem;
