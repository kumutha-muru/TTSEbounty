import React, { useState } from "react";
import { Grid, IconButton } from "@mui/material";
import CustomSideDrawer from "../side-drawer/CustomSideDrawer";
import MenuBar from "./MenuBar";
import MenuIcon from "@mui/icons-material/Menu";
const SideDrawer = ({ t }) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  return (
    <>
      <Grid item xs={2}>
        <IconButton variant="outlined" onClick={() => setSideDrawerOpen(true)}>
          <MenuIcon
            sx={{
              color: (theme) => theme.palette.primary.main,
            }}
          />
        </IconButton>
      </Grid>
      <CustomSideDrawer
        open={sideDrawerOpen}
        onClose={() => setSideDrawerOpen(false)}
        anchor="left"
      >
        <MenuBar t={t} />
      </CustomSideDrawer>
    </>
  );
};

SideDrawer.propTypes = {};

export default SideDrawer;
