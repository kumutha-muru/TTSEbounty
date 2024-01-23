import MainApi from "../../../MainApi";
import {  order_summary_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import {
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";

const getData = async (pageParams) => {
  const { data } = await MainApi.get(
    `${order_summary_api}?order_id=${pageParams?.order_id}`
  );
  return data;
};

export default function useGetOrderSummary(pageParams) {
  return useQuery("my-orders-list", () => getData(pageParams), {
    staleTime: 60000,
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
