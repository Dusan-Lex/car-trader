import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

export function Nav() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" sx={{ flexGrow: "1" }}>
          Car Trader
        </Typography>

        <Button color="inherit">
          <Link href="/">
            <a style={{ color: "white" }}>
              <Typography color="inherit">Home</Typography>
            </a>
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
