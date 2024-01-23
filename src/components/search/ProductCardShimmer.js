import React from "react";

import { Grid, Stack } from "@mui/material";
import { CardWrapper } from "../cards/ProductCard";
import { Skeleton } from "@mui/material";

const CustomShimmerForBestFood = () => {
  const [count, setCount] = React.useState(5);
 /*  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isMd = useMediaQuery(theme.breakpoints.down("lg"));
  
  useEffect(() => {
    if (isXSmall) {
      setCount(2);
    } else if (isSmall) {
      setCount(3);
    } else setCount(5);
  }, [isXSmall, isSmall, isMd]); */
  return (
    <>
      {[...Array(count)].map((item, index) => {
        return (
          <Grid item md={2.4} sm={4} xs={12} key={index}>
            <CardWrapper>
              <Stack spacing={1}>
                <Skeleton
                  variant="rectangular"
                  animation="pulse"
                  height={150}
                />
                <Stack padding="1rem">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={20}
                    width="80%"
                  />
                  <Skeleton variant="text" animation="wave" height={20} />

                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={20}
                    width="80%"
                  />
                  {/*<RatingStarIcon fontSize="small" color="#808080" />*/}
                  <Stack direction="row" spacing={2}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={70}
                      height={20}
                    />

                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={70}
                      height={20}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </CardWrapper>
          </Grid>
        );
      })}
    </>
  );
};

export default CustomShimmerForBestFood;
