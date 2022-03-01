import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import { red } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Link from "next/link";
import React from "react";
import { CarModel } from "../pages/api/cars";

export interface CarCardProps {
  car: CarModel;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link
      href="/car/[make]/[brand]/[id]"
      as={`/car/${car.make}/${car.model}/${car._id}`}
    >
      <a style={{ textDecoration: "none" }}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" sx={{ backgroundColor: red[500] }}>
                R
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={car.make + " " + car.model}
            subheader={`£${car.price}`}
          />
          <CardMedia
            sx={{ height: 0, paddingTop: "56.25%" }}
            image={car.photo_url}
            title={car.make + " " + car.model}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {car.details}
            </Typography>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
