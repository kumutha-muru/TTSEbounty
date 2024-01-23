import { useMutation } from "react-query";
import { order_place_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const orderPlace = async (orderData) => {
  const { data } = await MainApi.post(`${order_place_api}`, orderData);
  return data;
};
export const useOrderPlace = () => {
  return useMutation("order-place", orderPlace);
};
