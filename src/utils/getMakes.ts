import { connectToDatabase } from "./openDB";

export interface Make {
  _id: "string";
  count: number;
}

export const getMakes = async (): Promise<Make[]> => {
  const { db } = await connectToDatabase();
  const makes = await db
    .collection("cars")
    .aggregate([
      { $group: { _id: "$make", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    .toArray();
  return makes;
};
