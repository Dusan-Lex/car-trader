import { Grid, Paper, styled, Typography } from "@mui/material";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import React from "react";
import { connectToDatabase } from "../../../../utils/openDB.js";
import { CarModel } from "../../../api/cars";

interface CarDetailProps {
  car: CarModel | null;
}

const Img = styled("img")({
  width: "100%",
});
const CarDetails = ({ car }: CarDetailProps) => {
  if (!car) {
    return <h1>Sorry,car not found!</h1>;
  }
  return (
    <Paper sx={{ p: 2, margin: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={5}>
          <Img alt="complex" src={car.photo_url} />
        </Grid>
        <Grid item xs={12} sm={6} md={7} container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography variant="h5">{car.make + " " + car.model}</Typography>
              <Typography variant="h4" gutterBottom>
                {car.price} €
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Godina proizvodnje: {car.year}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pređeni kilometri: {car.kilometers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gorivo: {car.fuel_type === "Petrol" && "Benzin"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Detalji: {car.details}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CarDetails;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { id } = context.params;
  try {
    const { db, error } = await connectToDatabase();
    if (error) {
      return { props: { car: null } };
    }
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) });
    return { props: { car: JSON.parse(JSON.stringify(car)) } };
  } catch (error) {
    return { props: { car: null } };
  }
};
