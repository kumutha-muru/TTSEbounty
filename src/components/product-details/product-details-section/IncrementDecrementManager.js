import React from "react";
import { alpha, Stack, Typography } from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import {
  CustomFab,
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import { t } from "i18next";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "../../../helper-functions/CardHelpers";

const removeQuantity = (decrementQuantity, modalData,getModule) => {
  const quantityfilter = modalData?.wholesale_item_price?.filter(function (
    value
  ) {
    if (value.min_qty < value.max_qty) {
      return value;
    } else {
      return 0;
    }
  })[0]?.min_qty;

  return (
    <CustomFab
      onClick={decrementQuantity}
      aria-label="remove"
      disabled={
        modalData?.wholesale_item_price?.length < 0 ||
        modalData?.quantity <= 1 ||
        modalData?.quantity === quantityfilter
      }
      sx={{
        color:
          getModule()?.module_type === "pharmacy" ||
          getModule()?.module_type === "grocery"
            ? (theme) => theme.palette.neutral[1000]
            : (theme) => alpha(theme.palette.primary.main, 0.9),
        backgroundColor:
          getModule()?.module_type === "pharmacy" ||
          getModule()?.module_type === "grocery"
            ? (theme) => theme.palette.background.custom5
            : (theme) => alpha(theme.palette.primary.main, 0.2),
        boxShadow:
          getModule()?.module_type === "pharmacy" ||
          getModule()?.module_type === "grocery"
            ? "none"
            : "0px 2px 6px rgb(100 116 139 / 12%)",
        borderRadius:
          getModule()?.module_type === "pharmacy" ||
          getModule()?.module_type === "grocery"
            ? "0px"
            : "50%",
        "&:hover": {
          backgroundColor:
            getModule()?.module_type === "pharmacy" ||
            getModule()?.module_type === "grocery"
              ? (theme) => alpha(theme.palette.neutral[200], 0.2)
              : (theme) => alpha(theme.palette.primary.main, 0.4),
        },
      }}
    >
      <RemoveIcon size="small" />
    </CustomFab>
  );
};
const addRemoveProduct = (
  decrementQuantity,
  incrementQuantity,
  modalData,
  theme
) => {
  const getModule = () => {
    return JSON.parse(window.localStorage.getItem("module"));
  };
  const l = modalData?.wholesale_item_price?.length - 1;

  return (
    <Stack direction="row" spacing={4} alignItems="center">
      {/*<Typography fontWeight="400" color="customColor.textGray">*/}
      {/*  {t("Quantity")} :*/}
      {/*</Typography>*/}
      <Stack
        direction="row"
        alignIems="center"
        justifyContent="space-between"
        sx={{
          minWidth: { xs: "117px", sm: "130px", md: "142px" },
          backgroundColor:
            getModule()?.module_type === "pharmacy"
              ? theme.palette.background.custom5
              : (theme) => alpha(theme.palette.neutral[200], 0.2),
        }}
        borderRadius={
          getModule()?.module_type === "pharmacy" ||
          getModule()?.module_type === "grocery"
            ? "5px"
            : "13%"
        }
        padding={
          getModule()?.module_type === "pharmacy" ||
          getModule()?.module_type === "grocery"
            ? "5px"
            : "0px"
        }
      >
        {removeQuantity(decrementQuantity, modalData,getModule)}
        <Stack alignItems="center" justifyContent="center">
          <Typography variant="body1" fontWeight="500" textAlign="center">
            {modalData?.quantity < 10 && "0"}
            {modalData?.quantity}
          </Typography>
        </Stack>
        <CustomFab
          color="primary"
          aria-label="add"
          onClick={incrementQuantity}
          module_type={getModule()?.module_type}
          disabled={
            modalData?.wholesale_item_price[l]?.max_qty === modalData?.quantity
          }
          sx={{
            color:
              getModule()?.module_type === "pharmacy" ||
              getModule()?.module_type === "grocery"
                ? (theme) => theme.palette.neutral[1000]
                : (theme) => theme.palette.neutral[100],
            backgroundColor:
              getModule()?.module_type === "pharmacy" ||
              getModule()?.module_type === "grocery"
                ? theme.palette.background.custom5
                : (theme) => theme.palette.primary.main,
            borderRadius:
              getModule()?.module_type === "pharmacy" ||
              getModule()?.module_type === "grocery"
                ? "0px"
                : "50%",
            boxShadow:
              getModule()?.module_type === "pharmacy" ||
              getModule()?.module_type === "grocery"
                ? "none"
                : "0px 2px 6px rgb(100 116 139 / 12%)",
            "&:hover": {
              backgroundColor:
                getModule()?.module_type === "pharmacy" &&
                getModule()?.module_type === "grocery"
                  ? (theme) => alpha(theme.palette.neutral[200], 0.2)
                  : (theme) => alpha(theme.palette.primary.main, 0.7),
            },
          }}
        >
          <AddIcon size="small" />
        </CustomFab>
      </Stack>
    </Stack>
  );
};

const IncrementDecrementManager = (props) => {
  const { decrementQuantity, incrementQuantity, modalData, productUpdate } =
    props;
  const theme = useTheme();

  return (
    <CustomStackFullWidth spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography fontWeight="400" color="customColor.textGray">
          {t("Unit")} :
        </Typography>
        <Typography fontWeight="500">{modalData?.unit_type}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography fontWeight="400" color="customColor.textGray">
          Product Dimensions :
        </Typography>
        <Typography fontWeight="500">
          {Math.round(modalData?.length * 100) / 100}cm x
          {Math.round(modalData?.width * 100) / 100}cm x
          {Math.round(modalData?.height * 100) / 100}cm;
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography fontWeight="400" color="customColor.textGray">
          Weight :
        </Typography>
        <Typography fontWeight="500">
          {Math.round(modalData?.weight * 100) / 100}g
        </Typography>
      </Stack>
      <CustomStackFullWidth
        key={modalData}
        direction={productUpdate ? "column" : "row"}
        spacing={2}
        alignItems={productUpdate ? "flex-start" : "center"}
        justifyContent="flex-start"
      >
        {addRemoveProduct(
          decrementQuantity,
          incrementQuantity,
          modalData,
          theme
        )}
        <Stack
          direction="row"
          witdh="100%"
          spacing={1}
          paddingLeft={productUpdate ? "none" : { sm: "0px", md: "45px" }}
        >
          <Typography fontWeight="500" fontSize={{ xs: "12px", md: "14px" }}>
            {t("Total Price")}:
          </Typography>
          <Typography fontWeight="500" fontSize={{ xs: "12px", md: "16px" }}>
            {modalData &&
              getAmountWithSign(
                getDiscountedAmount(
                  modalData?.totalPrice,
                  modalData?.discount,
                  modalData?.discount_type,
                  modalData?.store_discount,
                  modalData?.quantity,
                  modalData?.wholesale_item_price
                )
              )}
          </Typography>
        </Stack>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

IncrementDecrementManager.propTypes = {};

export default IncrementDecrementManager;
