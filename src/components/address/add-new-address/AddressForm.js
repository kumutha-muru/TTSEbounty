import React, { useEffect } from "react";
import { Grid, Stack } from "@mui/material";
import { useFormik } from "formik";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import { useTranslation } from "react-i18next";

import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import ValidationSchemaForAddAddress from "./ValidationSchemaForAddAddress";

import usePostAddress from "../../../api-manage/hooks/react-query/address/usePostAddress";
import toast from "react-hot-toast";
import { onErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import { getLanguage } from "../../../helper-functions/getLanguage";
import FormSubmitButton from "../../profile/FormSubmitButton";

import useUpdatedAddress from "../../../api-manage/hooks/react-query/address/useUpdatedAddress";
import { useDispatch, useSelector } from "react-redux";
import { setGuestUserInfo } from "../../../redux/slices/guestUserInfo";
import { setOpenAddressModal } from "../../../redux/slices/addAddress";

const AddressForm = ({
  configData,
  deliveryAddress,
  personName,
  phone,
  lat,
  lng,
  popoverClose,
  refetch,
  isRefetcing,
  atModal,
  addressType,
  editAddress,setAddAddress,
  setEditAddress,
  setAddress,
  primaryKey
}) => {
  const { t } = useTranslation();

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { mutate, isLoading } = usePostAddress();
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdatedAddress();
  const addAddressFormik = useFormik({
    initialValues: {
      contact_person_email: token
        ? profileInfo?.email
        : guestUserInfo?.contact_person_email,
      address: editAddress?.address,
      latitude: editAddress?.latitude || lat,
      longitude: editAddress?.longitude || lng,
      address_type: token
        ? addressType || ""
        : guestUserInfo?.address_type || "",
      address_label: token ? "" : guestUserInfo?.address_label || "",
      contact_person_name: token
        ? personName || ""
        : guestUserInfo?.contact_person_name || "",
      contact_person_number: token
        ? phone || ""
        : guestUserInfo?.contact_person_number || "",
      additional_information: token
        ? editAddress?.additional_information || ""
        : guestUserInfo?.additional_information || "",
      road: "",
      house: token ? editAddress?.house || "" : guestUserInfo?.house || "",
      floor: token ? editAddress?.floor || "" : guestUserInfo?.floor || "",
      city: editAddress?.city || "",
      district: editAddress?.district || "",
      state: editAddress?.state || "",
      country: editAddress?.country || "",
      pincode: editAddress?.pincode || "",
      is_primary: primaryKey,
    },
    validationSchema: ValidationSchemaForAddAddress(),
    onSubmit: async (values, helpers) => {
      const stringLatitudeValue = values?.latitude.toString();
      const stringLongitudeValue = values?.longitude.toString();
      try {
        let newData = {
          ...values,
          address_type:
            values.address_label !== ""
              ? values.address_label
              : values.address_type,
          latitude: stringLatitudeValue,
          longitude: stringLongitudeValue,
        };
        formSubmitOnSuccess(newData);
      } catch (err) {}
    },
  });
  const tokenFormSubmit = (values) => {
    if (editAddress?.address_type) {
      const newValue = { ...values, id: editAddress?.id };
      updateMutate(newValue, {
        onSuccess: (response) => {
          if (atModal === "true") {
            toast.success(response?.message);
            popoverClose();
            refetch?.();
            setEditAddress({
              ...editAddress,
              address: deliveryAddress?.formatted_address,
              pincode: values.pincode,
            });
            setAddress({
              ...editAddress,
              address: deliveryAddress?.formatted_address,
              pincode: values.pincode,
            });
          } else {
            toast.success(response?.message);
            refetch?.();
            setAddAddress(false);
          }
        },
        onError: onErrorResponse,
      });
    } else {
      mutate(values, {
        onSuccess: (response) => {
          if (response) {
            if (atModal === "true") {
              toast.success(response?.message);
              popoverClose?.();
              refetch?.();
            } else {
              toast.success(response?.message);
              refetch?.();
              setAddAddress(false);
            }
          }
        },
        onError: onErrorResponse,
      });
    }
  };
  const formSubmitOnSuccess = (values) => {
    if (token) {
       tokenFormSubmit(values);
    } else {
      dispatch(setGuestUserInfo(values));
      setAddress({ ...values });
      dispatch(setOpenAddressModal(false));
    }
  };

  const nameHandler = (value) => {
    addAddressFormik.setFieldValue("contact_person_name", value);
  };
  const numberHandler = (value) => {
    addAddressFormik.setFieldValue("contact_person_number", value);
  };

  const addressLabelHandler = (value) => {
    addAddressFormik.setFieldValue("address_label", value);
  };
  const additionalHandler = (value) => {
    addAddressFormik.setFieldValue("additional_information", value);
  };
  
  const emailHandler = (value) => {
    addAddressFormik.setFieldValue("email", value);
  };
  let address_components = deliveryAddress?.address_components;
  useEffect(() => {
    addAddressFormik.setFieldValue(
      "contact_person_name",
      token ? personName || "" : guestUserInfo?.contact_person_name || ""
    );
    addAddressFormik.setFieldValue(
      "contact_person_number",
      token ? phone || "" : guestUserInfo?.contact_person_number || ""
    );
    addAddressFormik.setFieldValue(
      "contact_person_email",
      token ? profileInfo?.email : guestUserInfo?.contact_person_email
    );
    addAddressFormik.setFieldValue(
      "address",
      deliveryAddress?.formatted_address
    );
    addAddressFormik.setFieldValue("address_type", addressType);
    addAddressFormik.setFieldValue("is_primary", primaryKey);
    addAddressFormik.setFieldValue(
      "latitude",
      deliveryAddress?.geometry?.location?.lat
    );
    addAddressFormik.setFieldValue(
      "longitude",
      deliveryAddress?.geometry?.location?.lng
    );
    addAddressFormik.setFieldValue(
      "city",
      deliveryAddress?.address_components[address_components.length - 5]
        .long_name
    );
    addAddressFormik.setFieldValue(
      "district",
      deliveryAddress?.address_components[address_components.length - 4]
        .long_name
    );
    addAddressFormik.setFieldValue(
      "state",
      deliveryAddress?.address_components[address_components.length - 3]
        .long_name
    );
    addAddressFormik.setFieldValue(
      "country",
      deliveryAddress?.address_components[address_components.length - 2]
        .long_name
    );
    addAddressFormik.setFieldValue(
      "pincode",
      deliveryAddress?.address_components[address_components.length - 1]
        .long_name
    );
  }, [deliveryAddress, addressType, lat, lng, editAddress, primaryKey]);
  const lanDirection = getLanguage() || "ltr";

  const handleReset = () => {
    addAddressFormik.setFieldValue("contact_person_name", "");
    addAddressFormik.setFieldValue("contact_person_number", "");
    addAddressFormik.setFieldValue("additional_information", "");
    addAddressFormik.setFieldValue("house", "");
    addAddressFormik.setFieldValue("floor", "");
  };
  const submitButton = () => {
    if (token) {
      return editAddress?.address_type ? t("Update Address") : t("Add Address");
    } else {
      return guestUserInfo ? t("Update Address") : t("Add Address");
    }
  };
  return (
    <Stack>
      <form noValidate onSubmit={addAddressFormik.handleSubmit}>
        <Grid container spacing={2.8}>
          {addressType === "other" && (
            <Grid item xs={12} md={12}>
              <CustomTextFieldWithFormik
                type="text"
                label={t("Label Name(Optional)")}
                touched={addAddressFormik.touched.address_label}
                errors={addAddressFormik.errors.address_label}
                fieldProps={addAddressFormik.getFieldProps("address_label")}
                onChangeHandler={addressLabelHandler}
                value={addAddressFormik.values.address_label}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("Contact Person Name")}
              touched={addAddressFormik.touched.contact_person_name}
              errors={addAddressFormik.errors.contact_person_name}
              fieldProps={addAddressFormik.getFieldProps("contact_person_name")}
              onChangeHandler={nameHandler}
              value={addAddressFormik.values.contact_person_name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomPhoneInput
              required="true"
              type="text"
              onHandleChange={numberHandler}
              initCountry={configData?.country}
              touched={addAddressFormik.touched.contact_person_number}
              errors={addAddressFormik.errors.contact_person_number}
              fieldProps={addAddressFormik.getFieldProps(
                "contact_person_number"
              )}
              rtlChange="true"
              lanDirection={lanDirection}
              height="45px"
              value={addAddressFormik.values.contact_person_number}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              required
              label={t("Email")}
              touched={addAddressFormik.touched.contact_person_email}
              errors={addAddressFormik.errors.contact_person_email}
              fieldProps={addAddressFormik.getFieldProps(
                "contact_person_email"
              )}
              onChangeHandler={emailHandler}
              value={addAddressFormik.values.contact_person_email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              autoComplete="off"
              type="text"
              label={t("Address")}
              touched={addAddressFormik.touched.address}
              errors={addAddressFormik.errors.address}
              fieldProps={addAddressFormik.getFieldProps("address")}
              value={addAddressFormik.values.address}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Latitude")}
              disabled={true}
              touched={addAddressFormik.touched.latitude}
              errors={addAddressFormik.errors.latitude}
              fieldProps={addAddressFormik.getFieldProps("latitude")}
              value={addAddressFormik.values.latitude}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Longitude")}
              disabled={true}
              touched={addAddressFormik.touched.longitude}
              errors={addAddressFormik.errors.longitude}
              fieldProps={addAddressFormik.getFieldProps("longitude")}
              value={addAddressFormik.values.longitude}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("City")}
              disabled={true}
              fieldProps={addAddressFormik.getFieldProps("city")}
              value={addAddressFormik.values.city}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("District")}
              disabled={true}
              fieldProps={addAddressFormik.getFieldProps("district")}
              value={addAddressFormik.values.district}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("State")}
              disabled={true}
              fieldProps={addAddressFormik.getFieldProps("state")}
              value={addAddressFormik.values.state}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Pincode")}
              disabled={true}
              touched={addAddressFormik.touched.pincode}
              errors={addAddressFormik.errors.pincode}
              fieldProps={addAddressFormik.getFieldProps("pincode")}
              value={addAddressFormik.values.pincode}
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("House")}
              touched={addAddressFormik.touched.house}
              errors={addAddressFormik.errors.house}
              fieldProps={addAddressFormik.getFieldProps("house")}
              onChangeHandler={houseHandler}
              value={addAddressFormik.values.house}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Floor")}
              touched={addAddressFormik.touched.floor}
              errors={addAddressFormik.errors.floor}
              fieldProps={addAddressFormik.getFieldProps("floor")}
              onChangeHandler={floorHandler}
              value={addAddressFormik.values.floor}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Road")}
              touched={addAddressFormik.touched.road}
              errors={addAddressFormik.errors.road}
              fieldProps={addAddressFormik.getFieldProps("road")}
              onChangeHandler={roadHandler}
              value={addAddressFormik.values.road}
            />
          </Grid> */}
          <Grid item xs={12} md={12}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Additional Information")}
              touched={addAddressFormik.touched.additional_information}
              errors={addAddressFormik.errors.additional_information}
              fieldProps={addAddressFormik.getFieldProps(
                "additional_information"
              )}
              onChangeHandler={additionalHandler}
              value={addAddressFormik.values.additional_information}
              height="60px"
            />
          </Grid>
          <Grid item xs={12} md={12} align="end">
            <FormSubmitButton
              handleReset={handleReset}
              isLoading={
                editAddress?.address_type ? isUpdateLoading : isLoading
              }
              reset={t("Reset")}
              submit={submitButton()}
            />
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
};
export default AddressForm;
