import { getCollection } from "astro:content";

const perPage = 20;

export const getTrips = async (page: number) => {
  const allTrips = await getCollection("trips");

  return allTrips
    .map((trip) => ({
      ...trip.data,
      slug: trip.id,
      content: trip.body,
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice((page - 1) * perPage, page * perPage);
};

export const countTrips = async (): Promise<number> => {
  const allTrips = await getCollection("trips");
  return allTrips.length;
};
