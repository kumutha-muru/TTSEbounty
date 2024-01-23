import MainApi from "../../../MainApi";
import { add_address_api} from "../../../ApiRoutes";
import { useMutation } from "react-query";

const addData = async (postData) => {
  const { data } = await MainApi.post(add_address_api, postData);
  return data;
};

export default function usePostAddress() {
  return useMutation("add-address", addData);
}
