import * as React from "react";

import { GetServerSideProps } from "next";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectProps,
} from "@mui/material";
import theme from "../theme";
import { useRouter } from "next/router";
import { getMakes, Make } from "../utils/getMakes";
import { getModels, Model } from "../utils/getModels";
import { getAsString } from "../utils/getAsString";
import useSWR from "swr";

interface SearchProps {
  makes: Make[];
  models: Model[];
  singleColumn?: boolean;
}

const prices = [500, 1000, 5000, 15000, 25000, 50000, 2500000];

export default function Search({ makes, models, singleColumn }: SearchProps) {
  const { query, push } = useRouter();
  const smValue = singleColumn ? 12 : 6;
  const initialValues = {
    make: getAsString(query.make) || "all",
    model: getAsString(query.model) || "all",
    minPrice: getAsString(query.minPrice) || "all",
    maxPrice: getAsString(query.maxPrice) || "all",
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        push({ pathname: "/cars", query: { ...values, page: 1 } }, undefined, {
          shallow: true,
        });
      }}
    >
      {({ values }) => (
        <Form>
          <Paper
            elevation={5}
            sx={{ margin: "auto", maxWidth: 500, padding: theme.spacing(3) }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={smValue}>
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
              <Grid item xs={12} sm={smValue}>
                <ModelSelect name="model" make={values.make} models={models} />
              </Grid>
              <Grid item xs={12} sm={smValue}>
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
              <Grid item xs={12} sm={smValue}>
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
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Search for cars
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export const ModelSelect = ({ models, make, ...props }: ModelSelectProps) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({ name: props.name });

  React.useEffect(() => {
    setFieldValue("model", "all");
  }, [make]);

  const { data } = useSWR<Model[]>("/api/models?make=" + make, {
    dedupingInterval: 60000,
  });
  const newModels = data || models;
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="search-model">Model</InputLabel>
      <Select labelId="search-model" label="Model" {...field} {...props}>
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>
        {newModels.map((model, id) => (
          <MenuItem key={id} value={model._id}>
            {`${model._id} (${model.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make) || "";
  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);

  return {
    props: {
      makes: JSON.parse(JSON.stringify(makes)),
      models: JSON.parse(JSON.stringify(models)),
    },
  };
};
