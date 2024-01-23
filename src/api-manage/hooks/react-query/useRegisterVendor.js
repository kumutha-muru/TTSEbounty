import { useMutation } from "react-query";
import MainApi from "../../MainApi";

const registerVendor = async (vendorInfo) => {
  const { data } = await MainApi.post("/api/v1/auth/vendor/register", vendorInfo);
  return data;
};
export const useRegisterVendor = (onSuccessHandlerForReset, onErrorResponse) => {
  return useMutation("register-vendor", registerVendor, {
    onSuccess: onSuccessHandlerForReset,
    onError: onErrorResponse,
  });
};
