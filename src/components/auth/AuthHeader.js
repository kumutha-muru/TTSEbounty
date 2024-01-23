import React from "react";
import CustomImageContainer from "../CustomImageContainer";
import { Typography } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Box } from "@mui/system";
import { useRouter } from "next/router";

const AuthHeader = ({ title, configData }) => {
  const businessLogo = configData?.base_urls?.business_logo_url;
  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }
  const router = useRouter();
  const handleLogoClick = () => {
    if (router.pathname.includes("/auth")) {
      router.push("/home", undefined, { shallow: true });
    }
  };
  return (
    <CustomStackFullWidth
      justifyContent="center"
      alignItems="center"
      spacing={1}
      mb={5}
    >
      <Box onClick={handleLogoClick}>
        <CustomImageContainer
          width="185px"
          height="55px"
          objectfit="cover"
          src={`${businessLogo}/${configData?.logo}`}
        />
      </Box>

      <Typography variant="h4" textTransform="uppercase">
        {title}
      </Typography>
    </CustomStackFullWidth>
  );
};

export default AuthHeader;
