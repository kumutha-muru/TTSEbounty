import React from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const DeliveryManRegisterValidation = () => {
  const { t } = useTranslation();
  return Yup.object({
    f_name: Yup.string()
      .required(t("The firstname field is required!"))
      .min(3, t("The firstname must be atleast 3 characters"))
      .max(80, t("The firstname should not be more than 80 characters"))
      .matches(/^(?:\S.{0,}\S)?$/, "The firstname field is required!"),
    l_name: Yup.string()
      .required(t("The lastname field is required!"))
      .min(1, t("The lastname must be atleast 1 characters"))
      .max(80, t("The lastname should not be more than 80 characters"))
      .matches(/^(?:\S.{0,}\S)?$/, "The lastname field is required!"),
    email: Yup.string()
      .required(t("Email is required"))
      .min(3, "The email must be atleast 3 characters")
      .matches(
        /^([a-zA-Z0-9_\-\.]+)\+?([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
        "Please enter a valid email"
      ),
    vehicle_id: Yup.string().required(t("The vehicle field is required!")),
    identity_type: Yup.string().required(
      t("The identity type field is required!")
    ),
    identity_number: Yup.string()
      .required(t("The identity number field is required!"))
      .min(1, t("The identity number must be atleast 1 characters"))
      .max(200, t("Maximum of 200 Characters reached"))
      .matches(/^(?:\S.{0,}\S)?$/, "The identity number field is required!"),
    identity_image: Yup.string().required(
      t("The identity image field is required")
    ),
    phone: Yup.string()
      .required(t("Phone number is required"))
      .min(10, "Phone number must be 10 digits")
      .max(13, t("The phone should not be more than 10 characters")),
    password: Yup.string()
      .min(8, t("The password must be atleast 8 characters"))
      .max(30, t("The password should not be more than 30 characters"))
      .required(t("Password is required"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#~])[A-Za-z\d@$!%*?&#~]{8,}$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ),
    image: Yup.string().required(t("Deliveryman Image is required")),
    captcha: Yup.string().required(t("Captcha is required")),
  });
};

export default DeliveryManRegisterValidation;
