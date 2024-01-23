import React, { useEffect } from "react";
import TrackOrderInput from "../../src/components/track-order/TrackOrderInput";
import CssBaseline from "@mui/material/CssBaseline";
import SEO from "../../src/components/seo";
import MainLayout from "../../src/components/layout/MainLayout";
import { getServerSideProps } from "../index";
import CustomContainer from "../../src/components/container";
import { useDispatch } from "react-redux";
import { setConfigData } from "../../src/redux/slices/configData";

const TrackOrder = ({ configData }) => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setConfigData(configData));
  },[configData])
  return (
    <div>
      <CssBaseline />
      <SEO
     /*  image={`${configData?.base_urls?.business_logo_url}/${configData?.fav_icon}`}
      businessName={configData?.business_name} */
      />
      <MainLayout configData={configData}>
        <CustomContainer>
          <TrackOrderInput configData={configData} />
        </CustomContainer>
      </MainLayout>
    </div>
  );
};

export default TrackOrder;
export { getServerSideProps };
