import React from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
const RatingStar = (props) => {
  const { fontSize, color } = props;
  return (
    <StarRateIcon sx={{ fontSize: fontSize, color: color }} />
  );
};

RatingStar.propTypes = {};

export default RatingStar;
