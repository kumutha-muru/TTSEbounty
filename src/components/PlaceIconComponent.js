import React from "react";
import PlaceIcon from "@mui/icons-material/Place";
const PlaceIconComponent = (props) => {
  const { fontSize, color } = props;
  return (
    <div>
      <PlaceIcon sx={{ fontSize: fontSize, color: color }} />
    </div>
  );
};

export default PlaceIconComponent;
