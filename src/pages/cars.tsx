import { Grid, Pagination } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Search from ".";
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

  const changeHandler = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    router.push({ pathname: "/cars", query: { ...router.query, page: value } });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid item xs={12} sm={7} md={9}>
        <Pagination
          page={parseInt(getAsString(router.query.page) || "1")}
          count={totalPages}
          color="primary"
          onChange={changeHandler}
        />
        <pre>{JSON.stringify({ cars, totalPages }, null, 4)}</pre>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
