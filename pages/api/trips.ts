import { getTrips } from "helpers/trips";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const page = req.query.page as string;

  const trips = await getTrips(Number(page));
  const formattedTrips = trips.map(({ content, ...data }) => data);

  res.status(200).json(formattedTrips);
}
