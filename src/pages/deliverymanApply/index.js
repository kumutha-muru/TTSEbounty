import React from "react";
import MainLayout from "../../../src/components/layout/MainLayout";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../../../pages/meta-data";
import { NoSsr } from "@mui/material";
import RegisterDeliveryMan from "../../../src/components/deliveryman-apply";
import {getServerSideProps} from "../../../pages/index";

const index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <MetaData title={`Deliveryman Registration - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
          <NoSsr>
              <RegisterDeliveryMan configData={configData} />
          </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;

export {getServerSideProps}
