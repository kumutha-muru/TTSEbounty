import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import { NoSsr, useMediaQuery } from "@mui/material";
import ProductSearchPage from "../../src/components/search";
import { Box } from "@mui/system";
import ManageSearch from "../../src/components/header/second-navbar/ManageSearch";
import {getServerSideProps} from "../index";
const Index = ({ configData }) => {
  const matches = useMediaQuery("(max-width:1180px)");
  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }
  return (
    <>
      <CssBaseline />
      <MainLayout configData={configData}>
        <NoSsr>
          <Box marginBottom="10px" marginTop={!matches && "-2.5rem"}>
            {matches && (
              <ManageSearch maxwidth="true" token={token} zoneid={zoneid} />
            )}
          </Box>
          <ProductSearchPage configData={configData} token={token} />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;
export {getServerSideProps}
