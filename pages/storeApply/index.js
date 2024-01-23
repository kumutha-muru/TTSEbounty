import React from "react";
import MainLayout from "../../src/components/layout/MainLayout";
import { CustomContainer } from "../../src/components/footer/Footer.style";
import CssBaseline from "@mui/material/CssBaseline";
import SEO from "../../src/components/seo";
import { NoSsr } from "@mui/material";
import dynamic from "next/dynamic";
import RegisterStoreMan from "../../src/components/store-apply/register-store-man";
import {getServerSideProps} from "../../pages/index";
const index = ({ configData,landingPageData }) => {
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `Store Registration` : "Loading..."}
        image={`${configData?.base_urls?.business_logo_url}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
          <NoSsr>
              <RegisterStoreMan configData={configData} landingPageData={landingPageData}/>
          </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;

export {getServerSideProps}
