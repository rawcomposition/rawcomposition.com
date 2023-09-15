import * as React from "react";
import { SpeciesDate } from "lib/types";

type Props = {
  index: number;
  item: SpeciesDate;
};

function LifelistSpecies({ item }: Props) {
  return (
    <article className="mb-8">
      <h3 className="font-bold text-neutral-600 text-lg font-heading mb-4">{item.date}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {item.species.map(({ name, img, w, h }) => {
          return (
            <a key={img} href={`https://macaulaylibrary.org/asset/${img}`} target="_blank">
              <img
                width={w}
                height={h}
                src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${img}/900`}
                className="w-full"
                loading="lazy"
              />
              <div className="text-sm text-neutral-500 mt-1">{name}</div>
            </a>
          );
        })}
      </div>
    </article>
  );
}

export default React.memo(LifelistSpecies);
