import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { vehiclesList } from "../../ApiRoutes";
import { onErrorResponse } from "../../api-error-response/ErrorResponses";

const getVehicles = async () => {
  const { data } = await MainApi.get(vehiclesList);
  return data;
};

export default function useGetVehicles() {
  return useQuery("vehicles-list", getVehicles, {
    enabled: false,
    onError: onErrorResponse,
  });
}
