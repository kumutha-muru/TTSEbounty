import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Typography, alpha, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import { getCurrentModuleType } from "../../helper-functions/getCurrentModuleType";
import { ModuleTypes } from "../../helper-functions/moduleTypes";
import Loading from "../custom-loading/Loading";

const foodBasedModuleTheme = (theme) => {
  return getCurrentModuleType() === ModuleTypes.FOOD
    ? theme.palette.moduleTheme.food
    : theme.palette.primary.main;
};
const CustomButton = styled(Box)(({ theme, fill }) => ({
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:
    fill === "true"
      ? foodBasedModuleTheme(theme)
      : alpha(foodBasedModuleTheme(theme), 0.1),
  color:
    fill === "true"
      ? theme.palette.whiteContainer.main
      : foodBasedModuleTheme(theme),
  "&:hover": {
    filter: "brightness(0.6)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "25px",
    height: "25px",
  },
}));

const AddWithIncrementDecrement = (props) => {
  const {
    onHover,
    handleCardHoverFromCartIconClick,
    verticalCard,
    setIsButtonClicked,
    setShowAddtocart,
    setIsHover,
    addToCartHandler,
    isProductExist,
    handleIncrement,
    handleDecrement,
    count,
    isLoading,
    updateLoading,
  } = props;
  const [showIncDec, setShowIncDec] = useState(false);
  const theme = useTheme();
  const handleCart = (e) => {
    e.stopPropagation();
    handleCardHoverFromCartIconClick?.(e);
    addToCartHandler?.(e);
  };

  const incrementHandler = (e) => {
    e.stopPropagation();
    handleIncrement?.();
  };
  const decrementHandler = (e) => {
    e.stopPropagation();
    handleDecrement?.();
    if (count === 1) {
      if (verticalCard) {
        setIsButtonClicked?.(false);
        setShowAddtocart?.(true);
      }
    }
  };
  const handleMouseLeave = () => {
    if (verticalCard) {
      setTimeout(() => {
        setShowIncDec(false);
      }, 500);
    }
  };
  const handleMouseEnter = () => {
    if (verticalCard) {
      setIsHover(false);
      setShowIncDec(true);
    }
  };
  const handleBackgroundColor = () => {
    if (verticalCard) {
      return theme.palette.neutral[300];
    } else {
      return alpha(theme.palette.neutral[400], 0.1);
    }
  };
  const foodBasedThemeBackgroundColor = (theme) => {
    return getCurrentModuleType() === ModuleTypes.FOOD
      ? theme.palette.moduleTheme.food
      : "primary.main";
  };

  const hoverTheme = (theme) => {
    return onHover
      ? "none"
      : `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`;
  };
  const showShopBagIcon = () => {
    return isLoading ? (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: (theme) => theme.palette.neutral[100],
          color: (theme) => theme.palette.primary.main,
          height: { xs: "25px", md: "35px" },
          width: { xs: "25px", md: "35px" },
          borderRadius: "5px",
          transition: "all ease 0.5s",
          border: (theme) =>
            `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
          /* "&:hover": {
            backgroundColor: verticalCard && "primary.main",
            color: verticalCard && "whiteContainer.main",
          }, */
        }}
      >
        <Loading color={theme.palette.primary.main} />
      </Stack>
    ) : (
      <Stack
        onMouseEnter={handleMouseEnter}
        onClick={(e) => handleCart(e)}
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: (theme) =>
            onHover
              ? foodBasedThemeBackgroundColor(theme)
              : theme.palette.neutral[100],
          color: (theme) =>
            onHover
              ? "whiteContainer.main"
              : foodBasedThemeBackgroundColor(theme),
          height: { xs: "25px", md: "35px" },
          width: { xs: "25px", md: "35px" },
          borderRadius: "5px",
          transition: "all ease 0.5s",
          border: (theme) =>
            getCurrentModuleType() === ModuleTypes.FOOD
              ? "none"
              : hoverTheme(theme),
          /* "&:hover": {
            backgroundColor: verticalCard && "primary.main",
            color: verticalCard && "whiteContainer.main",
          }, */
        }}
      >
        <ShoppingBagIcon fontSize="small" />
      </Stack>
    );
  };
  const updateCount = () => {
    return updateLoading ? (
      <Stack width="50px">
        <Loading color={theme.palette.primary.main} />
      </Stack>
    ) : (
      <Typography
        onClick={(e) => e.stopPropagation()}
        textAlign="center"
        sx={{
          width: { xs: "30px", md: "50px" },
          transition: "all ease 0.5s",
        }}
      >
        {count}
      </Typography>
    );
  };
  const productExistContent = () => {
    if (isProductExist) {
      return (
        <Stack
          onMouseLeave={handleMouseLeave}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: handleBackgroundColor(),
            borderRadius: "10px",
          }}
        >
          <CustomButton onClick={(e) => decrementHandler(e)}>
            <RemoveIcon
              sx={{
                fontSize: { xs: "15px", md: "20px" },
                transition: "all ease 0.5s",
              }}
            />
          </CustomButton>

          {updateCount()}

          <CustomButton fill="true" onClick={(e) => incrementHandler(e)}>
            <AddIcon
              sx={{
                fontSize: { xs: "15px", md: "20px" },
                transition: "all ease 0.5s",
              }}
            />
          </CustomButton>
        </Stack>
      );
    } else {
      return <>{showShopBagIcon()}</>;
    }
  };
  const verticalCardContent = () => {
    if (showIncDec && isProductExist) {
      return (
        <Stack
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: handleBackgroundColor(),
            borderRadius: "10px",
            transition: "all ease 0.5s",
          }}
        >
          <CustomButton
            onClick={(e) => decrementHandler(e)}
            sx={{
              transition: "all ease 0.5s",
            }}
          >
            <RemoveIcon sx={{ fontSize: { xs: "15px", md: "20px" } }} />
          </CustomButton>

          {updateCount()}

          <CustomButton fill="true" onClick={(e) => incrementHandler(e)}>
            <AddIcon
              sx={{
                fontSize: { xs: "15px", md: "20px" },
                transition: "all ease 0.5s",
              }}
            />
          </CustomButton>
        </Stack>
      );
    } else {
      return (
        <Stack
          onMouseEnter={handleMouseEnter}
          onClick={(e) => handleCart(e)}
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: (theme) =>
              onHover ? "primary.main" : theme.palette.neutral[100],
            color: (theme) =>
              onHover ? "whiteContainer.main" : "primary.main",
            height: { xs: "25px", md: "35px" },
            width: { xs: "25px", md: "35px" },
            transition: "all ease 0.5s",
            borderRadius: "5px",
            border: (theme) =>
              onHover
                ? "none"
                : `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
            "&:hover": {
              backgroundColor: verticalCard && "primary.main",
              color: verticalCard && "whiteContainer.main",
            },
          }}
        >
          <ShoppingBagIcon fontSize="small" />
        </Stack>
      );
    }
  };
  const cardWiseManage = () => {
    if (verticalCard) {
      verticalCardContent();
    } else {
      return productExistContent();
    }
  };
  return <>{cardWiseManage()}</>;
};

AddWithIncrementDecrement.propTypes = {};

export default AddWithIncrementDecrement;
