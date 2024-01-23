import React from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import H1 from "../typographies/H1";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Skeleton } from "@mui/material";
import { isObjectEmpty } from "../../utils/CustomFunctions";
import CustomContainer from "../container";
import CustomImageContainer from "../../../src/components/CustomImageContainer";
import policyImage from "../../../public/landingpage/Return Policy banner.svg";

export const PolicyShimmer = () => (
  <CustomStackFullWidth>
    <Skeleton variant="text" width="100%" height="20px" />
    <Skeleton variant="text" width="70%" height="20px" />
    <Skeleton variant="text" width="50%" height="20px" />
  </CustomStackFullWidth>
);
const PolicyPage = (props) => {
  const { title, data, isFetching } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <CustomContainer>
      <Box minHeight="80vh">
        <Grid container item md={12} xs={12} spacing={3} mt="1rem">
          <CustomImageContainer
            width={isSmall ? "100%" : "100%"}
            height={isSmall ? "100%" : "100%"}
            objectfit="contained"
            src={policyImage.src}
          />
          <Grid
            item
            md={12}
            xs={12}
            alignItems="center"
            justifyContent="center"
          >
            <H1 text={title} />
          </Grid>
          <Grid item md={12} xs={12} sx={{ paddingBottom: "50px" }}>
            <Box>
              {isFetching ? (
                <PolicyShimmer />
              ) : (
                data &&
                !isObjectEmpty(data) && (
                  <div dangerouslySetInnerHTML={{ __html: data }}></div>
                )
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </CustomContainer>
  );
};

export default PolicyPage;
