import React from "react";
import { Grid, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import CustomEmptyResult from "../custom-empty-result";
import noData from "../../../public/static/newnoitem.png";
import StoreShimmer from "../Shimmer/StoreShimmer";
import StoreCard from "../cards/StoreCard";

const ItemSection = ({ campaignsDetails, isLoading }) => {
  const { configData } = useSelector((state) => state.configData);
  const matches = useMediaQuery("(max-width:1475px)");
  const matchesXs = useMediaQuery("(max-width:480px)");
  return (
    <>
      <Grid container spacing={{ xs: 0.5, md: 3 }}>
        {campaignsDetails?.stores?.length > 0 &&
          campaignsDetails?.stores?.map((store) => {
            return (
              <Grid
                key={store?.id}
                item
                md={matches ? 3 : 3}
                sm={4}
                xs={matchesXs ? 12 : 3}
              >
                <StoreCard
                  item={store}
                  imageUrl={`${configData?.base_urls?.store_cover_photo_url}/${store?.cover_photo}`}
                />
              </Grid>
            );
          })}
        {isLoading && <StoreShimmer />}
      </Grid>
      {campaignsDetails?.stores?.length === 0 && (
        <CustomEmptyResult
          label="No store found"
          image={noData}
          height="350px"
          withd="350px"
        />
      )}
    </>
  );
};

export default ItemSection;