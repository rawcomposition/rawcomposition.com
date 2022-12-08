import Feather from "icons/Feather";
import Clock from "icons/Clock";
import CheckCircle from "icons/CheckCircle";

type Props = {
  length?: string;
  species?: number;
  lifers?: number;
  isUS?: boolean;
};

function TripItem({ length, species, lifers, isUS }: Props) {
  return (
    <>
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
    </>
  );
}

export default TripItem;
