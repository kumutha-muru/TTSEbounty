import { Grid, Typography } from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import CustomButtonComponent from "./CustomButtonComponent";
import {CustomButton} from "./index";

const LargerScreen = (props) => {
  const { landingPageData, goToApp, t } = props;
  const router = useRouter();
  const handleSellerAppClick = (e) => {
    if (landingPageData?.download_business_app_links?.seller_playstore_url) {
      router.push(
        landingPageData?.download_business_app_links?.seller_playstore_url
      );
    } else {
      toast.error(t("No Redirect Url found"));
    }
  };
  const handleDeliverymanAppClick = (e) => {
    if (landingPageData?.download_business_app_links?.dm_playstore_url) {
      router.push(
        landingPageData?.download_business_app_links?.dm_playstore_url
      );
    } else {
      toast.error(t("No Redirect Url found"));
    }
  };
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={12} sm={12} md={6} paddingY="2rem">
        <CustomStackFullWidth spacing={4}>
          <CustomStackFullWidth spacing={1}>
            <Typography variant="h4" color="primary.main">
              {landingPageData?.business_title}
            </Typography>
            <Typography variant="h4" color="primary.main">
              {landingPageData?.business_sub_title}
            </Typography>
          </CustomStackFullWidth>

          <CustomStackFullWidth spacing={2}>
            {landingPageData?.download_business_app_links && (
              <CustomStackFullWidth
                gap={4}
                direction="row"
                flexGrow={1}
                flexWrap="wrap"
                alignItems="center"
              >
                {(landingPageData?.download_business_app_links
                  ?.seller_playstore_url_status === "1" ||
                  landingPageData?.download_business_app_links
                    ?.seller_appstore_url_status === "1") && (
                  <CustomButton
                    variant="contained"
                    onClick={(e) => handleSellerAppClick?.(e)}
                  >
                    {t("Seller App")}
                  </CustomButton>
                )}
                {(landingPageData?.download_business_app_links
                  ?.dm_playstore_url_status === "1" ||
                  landingPageData?.download_business_app_links
                    ?.dm_appstore_url_status === "1") && (
                  <CustomButton
                    variant="contained"
                    onClick={(e) => handleDeliverymanAppClick?.(e)}
                  >
                    {t("Deliveryman App")}
                  </CustomButton>
                )}
              </CustomStackFullWidth>
            )}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        textAlign={{ xs: "center", md: "right" }}
        sx={{
          height: "430px",
          position: "relative",
        }}
      >
        <CustomImageContainer
          src={`${landingPageData?.base_urls?.business_image_url}/${landingPageData?.business_image}`}
          objectfit="cover"
          height="100%"
          width="100%"
        />
      </Grid>
    </Grid>
  );
};

export default LargerScreen;
