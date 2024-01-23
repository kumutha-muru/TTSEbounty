import React from "react";
import FoodDetailModal from "./foodDetail-modal/FoodDetailModal";

const FoodDetails = (props) => {
  const { productDetailsData, configData } = props;
  return (
    <FoodDetailModal product={productDetailsData} configData={configData} />
  );
};

FoodDetails.propTypes = {};

export default FoodDetails;
