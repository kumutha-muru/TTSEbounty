import React, { useEffect } from "react";
import {  Grid, Stack } from "@mui/material";
import noData from "../../../public/static/nodata.png";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import useGetStoreReviews from "../../api-manage/hooks/react-query/review/useGetStoreReviews";
import CustomEmptyResult from "../custom-empty-result";
import ReviewCard from "./ReviewCard";
import { useSelector } from "react-redux";
import CustomShimmerCard from "../coupons/Shimmer";

const ReviewLists = ({ id }) => {
  const { configData } = useSelector((state) => state.configData);
  const { data, refetch } = useGetStoreReviews(id);
  useEffect(() => {
    refetch();
  }, []);

  return (
    <CustomStackFullWidth sx={{ minHeight: "60vh" }}>
      {data ? (
        <Grid container spacing={1}>
          {data?.map((review) => {
            return (
              <Grid item md={6} sm={6} xs={12} key={review.id}>
                <ReviewCard
                  review={review}
                  productImageUrl={configData?.base_urls?.item_image_url}
                />
              </Grid>
            );
          })}
          {data?.length === 0 && (
            <Grid item textAlign="center" md={12}>
              <Stack>
                <CustomEmptyResult label="No Review found" image={noData} />
              </Stack>
            </Grid>
          )}
        </Grid>
      ) : (
        <CustomShimmerCard />
      )}
    </CustomStackFullWidth>
  );
};
export default ReviewLists;
