import { connectToDatabase } from "./openDB";

export interface Model {
  _id: "string";
  count: number;
}

export const getModels = async (make: string): Promise<Model[]> => {
  const { db } = await connectToDatabase();
  const models = await db
    .collection("cars")
    .aggregate([
      { $match: { make: make } },
      { $group: { _id: "$model", count: { $sum: 1 } } },
    ])
    .toArray();
  return models;
};
