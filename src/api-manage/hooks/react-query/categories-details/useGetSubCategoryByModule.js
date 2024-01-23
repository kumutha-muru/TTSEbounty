import MainApi from "../../../MainApi";
import {
 categories_api
} from "../../../ApiRoutes";
import { useQuery } from "react-query";
import {
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";

const getSubCategoryByModule = async (module_id) => {
  const { data } = await MainApi.get(
    `${categories_api}?module_id=${module_id||1}`
  );
  return data;
};
export default function useGetSubCategoryByModule(moduleid) {
  return useQuery("subcategory-by-module", () => getSubCategoryByModule(moduleid), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
