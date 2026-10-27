export const SITE_TITLE = "RawComposition";
export const SITE_DESCRIPTION = "Bird Photography by Adam Jackson";

// Endemics data (island-endemics.ts) is still a work in progress
export const SHOW_ENDEMICS = false;

// Featured hero image. `img` must be the best photo of a species (otherwise it can't look up photo info).
// Only applies while `latestDate` (YYYY-MM-DD) is still the most recent life list date, so it's
// ignored automatically once newer lifers are synced. `position` is a CSS object-position.
// Set to null to use the latest lifer.
export const HERO_OVERRIDE: { img: number; latestDate: string; position?: string } | null = {
  img: 667689009, // Paradise Jacamar
  latestDate: "2026-10-26",
  position: "center 40%",
};
