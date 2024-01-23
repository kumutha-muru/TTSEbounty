import { useMutation } from "react-query";
import {
  submit_deliveryman_review_api,
} from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

/* import { onErrorResponse } from '../../../../components/api-response-messages/ApiResponseMessages' */

const submitData = async (formData) => {
  const { data } = await MainApi.post(
    `${submit_deliveryman_review_api}`,
    formData
  );
  return data;
};
export const useSubmitDeliverymanReview = () => {
  return useMutation("submit-review-deliveryman", submitData);
};
