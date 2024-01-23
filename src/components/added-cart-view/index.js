import React from "react";
import { useSelector } from "react-redux";
import EmptyCart from "./EmptyCart";
import CartActions from "./CartActions";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CartContents from "./CartContents";
import { getCartListModuleWise } from "../../helper-functions/getCartListModuleWise";
import CustomSideDrawer from "../side-drawer/CustomSideDrawer";
import DrawerHeader from "./DrawerHeader";
import CartIcon from "./assets/CartIcon";
import FreeDeliveryProgressBar from "./FreeDeliveryProgressBar";
import CartTotalPrice from "./CartTotalPrice";
import { useTheme } from "@emotion/react";
import DotSpin from "../DotSpin";
import { Stack } from "@mui/system";

const CardView = (props) => {
  const theme = useTheme();
  const { sideDrawerOpen, setSideDrawerOpen, cartList, refetch, isLoading } =
    props;
  const { configData } = useSelector((state) => state.configData);
  const imageBaseUrl = configData?.base_urls?.item_image_url;
  const closeHandler = () => {
    setSideDrawerOpen(false);
  };
  const cartContent = () => {
    return getCartListModuleWise(cartList)?.length === 0 ? (
      <EmptyCart
        cartList={getCartListModuleWise(cartList)}
        setSideDrawerOpen={setSideDrawerOpen}
      />
    ) : (
      <CartContents
        cartList={getCartListModuleWise(cartList)}
        imageBaseUrl={imageBaseUrl}
        refetch={refetch}
      />
    );
  };
  return (
    <CustomSideDrawer
      anchor="right"
      open={sideDrawerOpen}
      onClose={closeHandler}
      variant="temporary"
      maxWidth="420px"
      width="100%"
    >
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: "100vh" }}
      >
        <DrawerHeader
          CartIcon={
            <CartIcon
              width="18px"
              height="18px"
              color={theme.palette.primary.dark}
            />
          }
          title="Shopping Cart"
          closeHandler={closeHandler}
        />
        {isLoading ? (
          <Stack height="214px" width="100%" justifyContent="center">
            <DotSpin />
          </Stack>
        ) : (
          cartContent()
        )}

        {getCartListModuleWise(cartList).length > 0 &&
          configData?.free_delivery_over && (
            <FreeDeliveryProgressBar
              configData={configData}
              cartList={cartList}
            />
          )}
        {getCartListModuleWise(cartList).length > 0 && (
          <>
            <CartTotalPrice cartList={getCartListModuleWise(cartList)} />
            <CartActions
              setSideDrawerOpen={setSideDrawerOpen}
              cartList={getCartListModuleWise(cartList)}
            />
          </>
        )}
      </CustomStackFullWidth>
    </CustomSideDrawer>
  );
};

export default CardView;
