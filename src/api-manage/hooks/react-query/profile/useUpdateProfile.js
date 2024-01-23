import MainApi from "../../../MainApi";
import { profile_update_api } from "../../../ApiRoutes";
import { useMutation } from "react-query";
const updateProfile = async (postData) => {
  const { data } = await MainApi.post(profile_update_api, postData);
  return data;
};

export default function useUpdateProfile() {
  return useMutation("update-profile", updateProfile);
}
