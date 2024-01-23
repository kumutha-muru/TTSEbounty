import React from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { textWithEllipsis } from "../../styled-components/TextWithEllipsis";
import { IsSmallScreen } from "../../utils/CommonValues";

const H4 = (props) => {
  const { text } = props;
  const { t } = useTranslation();
  const classes = textWithEllipsis();
  return (
    <Typography
      variant={IsSmallScreen() ? "h8" : "subtitle2"}
      className={classes.singleLineEllipsis}
      maxHeight="20px"
    >
      {t(text)}
    </Typography>
  );
};

H4.propTypes = {};

export default H4;
