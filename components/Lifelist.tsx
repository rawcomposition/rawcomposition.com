import * as React from "react";
import Lightbox from "components/Lightbox";
import Species from "components/LifelistSpecies";
import { Species as SpeciesT } from "lib/types";
import Link from "next/link";
import overview from "lifelist/overview.json";
import ArrowRight from "icons/ArrowRight";
import ArrowLeft from "icons/ArrowLeft";

type Props = {
  total: number;
  year: string;
  species: SpeciesT[];
};

const defaultLightboxData = {
  imageId: "",
  caption: "",
  index: 0,
};

function Lifelist({ total, species, year }: Props) {
  const [lightboxData, setLightboxData] = React.useState(defaultLightboxData);

  const handleArrowPress = React.useCallback(
    (directionInt: number) => {
      const index = lightboxData.index;
      const imageIndex = species[index].images.map((image) => image.id).indexOf(lightboxData.imageId);
      if (species[index].images[imageIndex + directionInt]) {
        setLightboxData({
          ...lightboxData,
          imageId: species[index].images[imageIndex + directionInt].id,
        });
      } else if (species[index + directionInt]) {
        let newImage = species[index + directionInt].images[0];
        const newSpecies = species[index + directionInt];
        if (directionInt === -1) {
          newImage = newSpecies.images[newSpecies.images.length - 1];
        }
        setLightboxData({
          imageId: newImage.id,
          caption: newSpecies.name,
          index: index + directionInt,
        });
      }
    },
    [species, lightboxData]
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { keyCode } = e;
      if (keyCode === 39) {
        //Right arrow key
        handleArrowPress(+1);
      } else if (keyCode === 37) {
        //Left arrow key
        handleArrowPress(-1);
      }
    };
    window.addEventListener("keyup", handleKeyDown);
    return () => {
      window.removeEventListener("keyup", handleKeyDown);
    };
  }, [handleArrowPress]);

  const handleCloseLightbox = () => {
    setLightboxData(defaultLightboxData);
  };

  const yearIndex = overview.years.indexOf(year);
  const nextYear = overview.years[yearIndex - 1];
  const prevYear = overview.years[yearIndex + 1];

  return (
    <>
      <h1 className="font-heading text-neutral-600 text-4xl mb-1">World Life List</h1>
      <div className="flex justify-between items-center">
        <span className="text-neutral-400 font-bold">
          Showing {species.length} of {total}
        </span>
      </div>
      <br />
      {species.map((item, index) => (
        <Species key={item.name.replace(/\W+/g, "-")} index={index} item={item} setLightboxData={setLightboxData} />
      ))}
      <div className="flex justify-center items-center gap-4">
        {prevYear && (
          <Link href={`/lifelist/${prevYear}`} className="bg-[#f4793d] text-white py-2 px-8 flex gap-2 items-center">
            <ArrowLeft />
            {prevYear}
          </Link>
        )}
        {nextYear && (
          <Link href={`/lifelist/${nextYear}`} className="bg-[#f4793d] text-white py-2 px-8 flex gap-2 items-center">
            {nextYear}
            <ArrowRight />
          </Link>
        )}
      </div>
      <Lightbox data={lightboxData} handleClose={handleCloseLightbox} />
    </>
  );
}

export default Lifelist;
