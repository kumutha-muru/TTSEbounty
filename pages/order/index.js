import React, { useEffect } from "react";
import MainLayout from "../../src/components/layout/MainLayout";
import OrderSuccessPage from "../../src/components/order-success-page";
import CssBaseline from "@mui/material/CssBaseline";
import { getServerSideProps } from "../index";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import { NoSsr } from "@mui/material";
import { getToken } from "../../src/helper-functions/getToken";
import { useDispatch } from "react-redux";
import { setConfigData } from "../../src/redux/slices/configData";

const index = ({ configData, landingPageData }) => {
  const token = getToken();
  const dispatch= useDispatch();
  useEffect(()=>{
    dispatch(setConfigData(configData));
  },[configData])
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `Order` : "Loading..."}
        image={`${configData?.base_urls?.business_logo_url}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <CustomContainer>
          <NoSsr>{!token && <OrderSuccessPage configData={configData} />}</NoSsr>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

index.propTypes = {};

export default index;
export { getServerSideProps };
