import React from "react";

import MainLayout from "../../src/components/layout/MainLayout";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../../meta-data";
import { NoSsr } from "@mui/material";
import RegisterStoreMan from "../../src/components/store-apply/register-store-man";
import {getServerSideProps} from "../../index";
const index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <MetaData title={`Store Registration - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
          <NoSsr>
              <RegisterStoreMan configData={configData} />
          </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;

export {getServerSideProps}
