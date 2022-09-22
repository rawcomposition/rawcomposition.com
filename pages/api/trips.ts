import { getTrips } from "helpers/trips";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const page = req.query.page as string;

  const trips = getTrips(parseInt(page));

  res.status(200).json(trips);
}
