import React from "react";
import MainLayout from "../../../src/components/layout/MainLayout";
import {getServerSideProps} from "../../index";
import CssBaseline from "@mui/material/CssBaseline";
import dynamic from "next/dynamic";
import SEO from "../../../components/seo";

const index = ({ configData }) => {
  const SignUp = dynamic(
    () => import("../../../src/components/auth/sign-up/SignUp"),
    {
      ssr: false,
    }
  );
  return (
    <>
      <CssBaseline />
      <SEO title={`Sign Up - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <SignUp />
      </MainLayout>
    </>
  );
};

export default index;

export {getServerSideProps}
