import React from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const StoreManRegisterValidation = () => {
  const { t } = useTranslation();
  return Yup.object({
    phone: Yup.string()
      .required(t("Phone number is required"))
      .min(12, t("Phone number must be 10 digits"))
      .max(13, t("The phone should not be more than 10 characters")),
    password: Yup.string()
      .matches(
        /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        t("Password must contain at least 8 characters, one uppercase, one number and one special case character")
      )
      .required(t("Password is required")),
    name: Yup.string().required(t("Store name is required")),
    address: Yup.string().required(t("Address is required")),
    store_type: Yup.string().required(t("Store type is required")),
    logo: Yup.string().required(t("Logo is required")),
    latitude: Yup.number().required(t("Latitude is required")),
    longitude: Yup.number().required(t("Longitude is required")),
    f_name: Yup.string().required(t("Firstname is required")),
    l_name: Yup.string().required(t("Lastname is required")),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], t("Password Not Matched."))
      .required(t("Confirm password is required")),
    email: Yup.string().email().required(t("Email is required")),
    /* recaptcha: Yup.boolean().required(t("Invalid recaptcha")), */
    recaptcha: Yup.boolean().oneOf([true],t("Enter recaptcha")),
    minimum_delivery_time: Yup.number()
      .positive("Must be a positive value")
      .required(t("Minimum time is required")),
    maximum_delivery_time: Yup.number()
      .positive("Must be a positive value")
      .required(t("Maximum time is required"))
      .moreThan(
        Yup.ref("minimum_delivery_time"),
        "Minimum delivery time type is should be greater than Maximum delivery time type"
      ),
    delivery_time_type: Yup.string().required(
      t("Delivery time type is required")
    ),
    categories: Yup.string().required(t("Please Choose an Category.")),
   /*  categories: Yup.array().length.required(t("Please Choose an Category")),
    subscription_id: Yup.number()
    .required(t("Please Choose an Plan")),
    categories: Yup.number()
    .required(t("Please Choose an Category")),
    categories: Yup.array().of(
      Yup.object().shape({
        categories:Yup.string()
        .required(t("Please Choose an Category")),
      })
    ), */
    subscription_id: Yup.number().when("commission_plan_type", {
      is: 1,
      then: Yup.number().required(t("please choose subscription")),
    }),
    cover_photo: Yup.string().required(
      t("The identity image field is required")
    ),
    logo: Yup.string().required(t("The identity image field is required")),
  });
};

export default StoreManRegisterValidation;
