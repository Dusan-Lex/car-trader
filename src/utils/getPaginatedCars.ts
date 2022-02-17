import { ParsedUrlQuery } from "querystring";
import { getAsString } from "./getAsString";
import { connectToDatabase } from "./openDB";

export const getPaginatedCars = async (query: ParsedUrlQuery) => {
  const { db } = await connectToDatabase();
  const make = getAsString(query.make) || "all";
  const model = getAsString(query.model) || "all";
  const minPrice = getAsString(query.minPrice) || "all";
  const maxPrice = getAsString(query.maxPrice) || "all";
  const page = query.page ? +query.page : 1;
  const rowsPerPage = query.rowsPerPage ? +query.rowsPerPage : 2;
  const offset = (page - 1) * rowsPerPage;

  const carsPromise = db
    .collection("cars")
    .aggregate([
      { $match: make === "all" ? {} : { make: make } },
      { $match: model === "all" ? {} : { model: model } },
      { $match: minPrice === "all" ? {} : { price: { $gte: +minPrice } } },
      { $match: maxPrice === "all" ? {} : { price: { $lte: +maxPrice } } },
    ])
    .skip(offset)
    .limit(rowsPerPage)
    .toArray();

  const totalRowsPromise = db
    .collection("cars")
    .aggregate([
      { $match: make === "all" ? {} : { make: make } },
      { $match: model === "all" ? {} : { model: model } },
      { $match: minPrice === "all" ? {} : { price: { $gte: +minPrice } } },
      { $match: maxPrice === "all" ? {} : { price: { $lte: +maxPrice } } },
      { $count: "total" },
    ])
    .toArray();

  let [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);
  totalRows = totalRows.length ? totalRows[0].total : 0;
  return { cars, totalPages: Math.ceil(totalRows / rowsPerPage) };
};
