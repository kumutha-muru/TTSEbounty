import React from "react";
import {
  alpha,
  TableRow,
  useMediaQuery,
  useTheme,
  Skeleton
} from "@mui/material";
import { Stack } from "@mui/system";
import { CustomTableCell } from "./index";

const TransactionShimmer = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      {[...Array(4)].map((item, index) => {
        return (
          <>
            {isSmall ? (
              <Stack
                key={item?.id}
                spacing={1.8}
                padding="14px 11px"
                backgroundColor={theme.palette.neutral[300]}
                borderRadius="10px"
                marginBottom="10px"
              >
                <Stack direction="row" justifyContent="space-between">
                  <Skeleton variant="text" width="100px" height="20px" />
                  <Skeleton variant="text" width="100px" height="20px" />
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Skeleton variant="text" width="100px" height="20px" />
                  <Skeleton variant="text" width="40px" height="20px" />
                </Stack>
              </Stack>
            ) : (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: (theme) =>
                    alpha(theme.palette.neutral[300], 0.5),
                  borderRadius: "5px",
                }}
              >
                <CustomTableCell>
                  <Skeleton width="100px" height="25px" />
                </CustomTableCell>
                <CustomTableCell>
                  <Skeleton width="100px" height="25px" />
                </CustomTableCell>
                <CustomTableCell>
                  <Skeleton width="100px" height="25px" />
                </CustomTableCell>
              </TableRow>
            )}
          </>
        );
      })}
    </>
  );
};

export default TransactionShimmer;
