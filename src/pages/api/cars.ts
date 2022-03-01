import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPaginatedCars } from "../../utils/getPaginatedCars";

export interface CarModel {
  _id: ObjectId;
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  kilometers: number;
  details: string;
  price: number;
  photo_url: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const cars = await getPaginatedCars(req.query);
  res.json(cars);
  // try {
  //   const { db } = await connectToDatabase();
  //   const result = (await db
  //     .collection("cars")
  //     .find({})
  //     .toArray()) as CarModel[];
  //   res.status(200).send(result);
  // } catch (err: unknown) {
  //   if (err instanceof Error) {
  //     res.status(500).send({ message: err.message });
  //   }
  // }
};

export default handler;
