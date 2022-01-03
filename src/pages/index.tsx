import * as React from "react";

import { GetServerSideProps } from "next";
import { connectToDatabase } from "../utils/openDB";
import { Field, Form, Formik } from "formik";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import theme from "../theme";
import { useRouter } from "next/router";

interface Make {
  _id: "string";
  count: number;
}

interface HomeProps {
  makes: Make[];
}

const prices = [500, 1000, 5000, 15000, 25000, 50000, 2500000];

export default function Home({ makes }: HomeProps) {
  const { query } = useRouter();
  const initialValues = {
    make: query.make || "all",
    model: query.model || "all",
    minPrice: query.minPrice || "all",
    maxPrice: query.maxPrice || "all",
  };
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <Paper
            elevation={5}
            sx={{ margin: "auto", maxWidth: 500, padding: theme.spacing(3) }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-make">Make</InputLabel>
                  <Field
                    name="make"
                    as={Select}
                    labelId="search-make"
                    label="make"
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((make, id) => (
                      <MenuItem key={id} value={make._id}>
                        {`${make._id} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                Model
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-min-price">Min Price</InputLabel>
                  <Field
                    name="minPrice"
                    as={Select}
                    labelId="search-min-price"
                    label="Min Price"
                  >
                    <MenuItem value="all">
                      <em>No Min</em>
                    </MenuItem>
                    {prices.map((price, id) => (
                      <MenuItem key={id} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-max-price">Max Price</InputLabel>
                  <Field
                    name="maxPrice"
                    as={Select}
                    labelId="search-max-price"
                    label="Max Price"
                  >
                    <MenuItem value="all">
                      <em>No Max</em>
                    </MenuItem>
                    {prices.map((price, id) => (
                      <MenuItem key={id} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { db } = await connectToDatabase();
  const makes = await db
    .collection("cars")
    .aggregate([{ $group: { _id: "$make", count: { $sum: 1 } } }])
    .toArray();
  return { props: { makes: JSON.parse(JSON.stringify(makes)) } };
};
