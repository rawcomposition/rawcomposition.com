import { HERO_OVERRIDE } from '@/consts';
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

const toDay = (date: string) => date.slice(0, 10);

/**
 * The species featured in the hero/banner. Uses HERO_OVERRIDE when it matches a
 * photographed species and its latestDate is still the most recent lifer date,
 * otherwise the most recent lifer.
 */
export function getHeroLifer() {
	const latestDay = toDay(speciesByDateDesc[0].date);
	const overrideImg = HERO_OVERRIDE?.latestDate === latestDay ? HERO_OVERRIDE.img : undefined;
	const override = overrideImg ? allSpecies.find((sp) => sp.img === overrideImg) : undefined;
	const heroLifer = override ?? speciesByDateDesc[0];
	return {
		heroLifer,
		// A same-day override is still a "latest" lifer
		isOverride: toDay(heroLifer.date) !== latestDay,
		heroPosition: override ? HERO_OVERRIDE?.position : undefined,
	};
}
