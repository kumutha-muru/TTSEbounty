import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { zoneList } from "../../ApiRoutes";
import { onErrorResponse } from "../../api-error-response/ErrorResponses";

const getZones = async () => {
  const { data } = await MainApi.get(zoneList);
  return data;
};

export default function useGetZone() {
  return useQuery("zone-list", getZones, {
    enabled: false,
    onError: onErrorResponse,
  });
}
