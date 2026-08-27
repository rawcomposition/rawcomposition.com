import { HERO_IMG_OVERRIDE } from '@/consts';
import byFamily from '../../lifelist/by-family.json';

export type Species = {
	name: string;
	code: string;
	count: number;
	date: string;
	year: string;
	family: string;
	img: number;
	w: number;
	h: number;
};

export const familyData = byFamily as { family: string; species: Species[] }[];
export const allSpecies = familyData.flatMap((it) => it.species);

/** Newest first, with a stable tie-break so every page picks the same order. */
export const speciesByDateDesc = [...allSpecies].sort(
	(a, b) => b.date.localeCompare(a.date) || b.img - a.img
);

/**
 * The species featured in the hero/banner. Uses HERO_IMG_OVERRIDE when it
 * matches a photographed species, otherwise the most recent lifer.
 */
export function getHeroLifer() {
	const override = HERO_IMG_OVERRIDE ? allSpecies.find((sp) => sp.img === HERO_IMG_OVERRIDE) : undefined;
	return { heroLifer: override ?? speciesByDateDesc[0], isOverride: !!override };
}
