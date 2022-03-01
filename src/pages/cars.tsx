import { Grid, Pagination } from "@mui/material";
import deepEqual from "fast-deep-equal";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { useState } from "react";
import useSWR from "swr";
import Search from ".";
import { CarCard } from "../components/CarCard";
import { getAsString } from "../utils/getAsString";
import { getMakes, Make } from "../utils/getMakes";
import { getModels, Model } from "../utils/getModels";
import { getPaginatedCars } from "../utils/getPaginatedCars";
import { CarModel } from "./api/cars";

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

export default function CarsList({
  makes,
  models,
  cars,
  totalPages,
}: CarsListProps) {
  const router = useRouter();
  const [serverQuery] = useState(router.query);
  const { data } = useSWR("/api/cars?" + stringify(router.query), {
    dedupingInterval: 15000,
    fallbackData: deepEqual(router.query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  });
  const changeHandler = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    router.push(
      { pathname: "/cars", query: { ...router.query, page: value } },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid container item xs={12} sm={7} md={9} spacing={3}>
        <Grid item xs={12}>
          <Pagination
            page={parseInt(getAsString(router.query.page) || "1")}
            count={data?.totalPages}
            color="primary"
            onChange={changeHandler}
          />
        </Grid>

        {data?.cars.map((car) => (
          <Grid key={car._id.toString()} item xs={12} sm={6}>
            <CarCard car={car} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Pagination
            page={parseInt(getAsString(router.query.page) || "1")}
            count={data?.totalPages}
            color="primary"
            onChange={changeHandler}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps: GetServerSideProps<CarsListProps> = async (
  ctx
) => {
  const make = getAsString(ctx.query.make) || "";
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);

  return {
    props: {
      makes: JSON.parse(JSON.stringify(makes)),
      models: JSON.parse(JSON.stringify(models)),
      cars: JSON.parse(JSON.stringify(pagination.cars)),
      totalPages: JSON.parse(JSON.stringify(pagination.totalPages)),
    },
  };
};
