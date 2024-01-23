import React, { useEffect } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import { Grid, Skeleton, useMediaQuery } from "@mui/material";
import CustomEmptyResult from "../../custom-empty-result";
import nodata from "../../loyalty-points/assets/Search.svg";
import { CustomPaper } from "../../../components/my-orders/order/index";
import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import GuestOrder from "./TrackOrder";
import useGetOrderSummary from "../../../api-manage/hooks/react-query/order/useGetOrderSummary";
import { useRouter } from "next/router";

const CustomShimmerCard = ({ isXs }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <CustomBoxFullWidth>
      <Grid container spacing={3}>
        {[...Array(6)].map((item, index) => {
          return (
            <Grid item xs={12} sm={isXs ? 12 : 6} md={12} lg={12} key={index}>
              <CustomPaper>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    width="100%"
                  >
                    <Skeleton
                      variant="rectangular"
                      width={isSmall ? "100px" : "90px"}
                      height={isSmall ? "100px" : "72px"}
                    />
                    <Stack width="100%" spacing={0.5}>
                      <Skeleton
                        variant="text"
                        width="200px"
                        height={isSmall ? "15px" : "20px"}
                      />
                      <Skeleton
                        variant="text"
                        width="130px"
                        height={isSmall ? "15px" : "20px"}
                      />
                      <Skeleton
                        variant="text"
                        width="130px"
                        height={isSmall ? "15px" : "20px"}
                      />
                      {isSmall && (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Skeleton
                            variant="text"
                            width="100px"
                            height="20px"
                          />
                          <Skeleton
                            variant="text"
                            width="100px"
                            height="35px"
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                  {!isSmall && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Skeleton variant="text" width="130px" height="40px" />
                      <Skeleton variant="text" width="130px" height="60px" />
                    </Stack>
                  )}
                </Stack>
              </CustomPaper>
            </Grid>
          );
        })}
      </Grid>
    </CustomBoxFullWidth>
  );
};
const GuestTrackOrder = (props) => {
  const { configData } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isXs = useMediaQuery("(max-width:700px)");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { order_id } = router.query;

  const { data, refetch } = useGetOrderSummary({
    order_id: order_id,
  });
  useEffect(() => {
    if (order_id) {
      refetch();
    }
  }, []);
  const handleInnerContent = () => {
    if (data) {
      if (data?.orders?.length === 0) {
        return (
          <CustomEmptyResult
            image={nodata}
            label="No Orders Found"
            width="128px"
            height="128px"
          />
        );
      } else {
        return (
          <Grid container spacing={2}>
            {data &&
              data?.orders?.length > 0 &&
              data?.orders?.map((order, index) => (
                <Grid
                  item
                  xs={12}
                  sm={isXs ? 12 : 6}
                  md={12}
                  lg={12}
                  key={order?.id}
                >
                  <GuestOrder
                    index={index}
                    order={order}
                    t={t}
                    data={data}
                    configData={configData}
                    dispatch={dispatch}
                  />
                </Grid>
              ))}
          </Grid>
        );
      }
    } else {
      return <CustomShimmerCard isXs={isXs} />;
    }
  };
  return (
    <CustomStackFullWidth
      spacing={2}
      sx={{
        minHeight: "80vh",
        padding: isSmall ? "10px 10px 10px 10px" : "20px 20px 20px 27px",
      }}
    >
      <CustomStackFullWidth spacing={3}>
        {handleInnerContent()}
        {/* {data?.total_size > data_limit && (
          <CustomPagination
            total_size={data?.total_size}
            page_limit={data_limit}
            // offset={offset}
            // setOffset={setOffSet}
          />
        )} */}
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default GuestTrackOrder;
