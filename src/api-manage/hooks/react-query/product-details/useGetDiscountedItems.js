import { useInfiniteQuery, useQuery } from "react-query";
import {
  discounted_product_api,
  discounted_stores_api,
} from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";

const getDiscountedItems = async (params) => {
  const { limit, offset, pageParam } = params;
  const dicountAPI = () => {
    return params?.currentTab === 0
      ? discounted_product_api
      : discounted_stores_api;
  };
  const { data } = await MainApi.get(
    `${
      params?.currentTab ? dicountAPI() : discounted_product_api
    }?limit=${limit}&offset=${pageParam || offset}`
  );
  return data;
};

export default function useGetDiscountedItems(params) {
  return useQuery(["discounted-product"], () => getDiscountedItems(params), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
export function useGetDiscountedItemsWithInfiniteScroll(params) {
  const lastPageAPI = (lastPage) => {
    return params?.currentTab === 0
      ? lastPage?.products?.length
      : lastPage?.stores?.length;
  };
  return useInfiniteQuery(
    ["discounted-product-with-infinite-scroll", params?.currentTab],
    ({ pageParam = 1 }) => getDiscountedItems({ ...params, pageParam }),
    {
      /*  enabled: false,
      onError: onSingleErrorResponse, */
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPageAPI(lastPage) > 0 ? nextPage : undefined;
      },
      getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
      enabled: false,
      onError: onErrorResponse,
      cacheTime: "0",
    }
  );
}
