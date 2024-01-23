import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { subscription_plan_List } from "../../ApiRoutes";
import { onErrorResponse } from "../../api-error-response/ErrorResponses";

const getSubscriptionPlans = async () => {
  const { data } = await MainApi.get(subscription_plan_List);
  return data;
};

export default function useGetSubscriptionPlan() {
  return useQuery("subscription-planlist", getSubscriptionPlans, {
    enabled: false,
    onError: onErrorResponse,
  });
}
