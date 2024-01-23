import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import { Router, useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { RouteLinksData } from "../demoLinks";

const RouteLinks = (props) => {
  const { token, configData } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const handleClick = (href, value) => {
    if (value === "loyalty_points" || value === "my_wallet") {
      if (token) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must be login to access this page."));
      }
    } else if (value === "campaigns") {
      const zoneId = localStorage.getItem("zoneid");
      if (zoneId) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must pick a zone to access this page."));
      }
    } else if (value === "storeApply") {
      router.push(href, undefined, { shallow: true });
    } else if (value === "deliverymanApply") {
      router.push(href, undefined, { shallow: true });
    } else if (value === "help-and-support") {
      router.push(href, undefined, { shallow: true });
    }
  };
  let language_direction;
  // = localStorage.getItem("direction");
  const handleClickToRoute = (href) => {
    router.push(href, undefined, { shallow: true });
  };
  const theme = useTheme();
  return (
    <CustomStackFullWidth spacing={1}>
      {RouteLinksData.map((item, index) => {
        return (
          <Typography
            key={index}
            onClick={() => handleClick(item.link, item.value)}
            color="whiteContainer.main"
            sx={{
              cursor: "pointer",
              transition: "all ease-out .3s",
              "&:hover": {
                letterSpacing: "0.03em",
              },
            }}
          >
            {t(item.name)}
          </Typography>
        );
      })}

      <Typography
        onClick={() => handleClickToRoute("/about-us")}
        color="whiteContainer.main"
        sx={{
          cursor: "pointer",
          transition: "all ease-out .3s",
          "&:hover": {
            letterSpacing: "0.03em",
          },
        }}
      >
        {t("About Us")}
      </Typography>
      <Typography
        onClick={() => handleClickToRoute("/track-order")}
        color="whiteContainer.main"
        sx={{
          cursor: "pointer",
          transition: "all ease-out .3s",
          "&:hover": {
            letterSpacing: "0.03em",
          },
        }}
      >
        {t("Track Order")}
      </Typography>
    </CustomStackFullWidth>
  );
};

RouteLinks.propTypes = {};

export default RouteLinks;
