import { useMutation } from "react-query";
import MainApi from "../../MainApi";

const registerDeliveryMan = async (deliveryManInfo) => {
  const { data } = await MainApi.post("/api/v1/auth/delivery-man/store", deliveryManInfo);
  return data;
};
export const useRegisterDeliveryMan = (onSuccessHandlerForReset, onErrorResponse) => {
  return useMutation("register-deliveryman", registerDeliveryMan, {
    onSuccess: onSuccessHandlerForReset,
    onError: onErrorResponse,
  });
};
