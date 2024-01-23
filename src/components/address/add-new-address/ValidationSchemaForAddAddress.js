import React from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const ValidationSchemaForAddAddress = () => {
  const { t } = useTranslation();
  return Yup.object({
    address: Yup.string().required(t("Address is required")),
    contact_person_name: Yup.string().required(t("Name is required")),
    contact_person_number: Yup.string()
      .required(t("Phone Number is required"))
      .min(12, "phone number must be 10 digits")
      .max(13, t("The phone should not be more than 10 characters")),
    contact_person_email:Yup.string()
    .email(t("Must be a valid email"))
    .max(255)
    .required(t("Email is required")),
  });
};
export default ValidationSchemaForAddAddress;
