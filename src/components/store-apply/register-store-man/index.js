import React, { useEffect, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import {
  NoSsr,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";

import StoreApplyForm from "./StoreApplyForm";
import { t } from "i18next";
/* import AcceptTermsAndConditions from "../../../../pages/auth/AcceptTermsAndConditions"; */
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/router";
import StoreManRegisterValidation from "./StoreManRegisterValidation";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { useRegisterVendor } from "../../../api-manage/hooks/react-query/useRegisterVendor";
import { useDispatch } from "react-redux";
import {
  SettingsConsumer,
  SettingsProvider,
} from "../../../contexts/settings-context";
import useGetSubscriptionPlan from "../../../api-manage/hooks/react-query/useGetSubscriptionPlan";
import useGetZone from "../../../api-manage/hooks/react-query/useGetZones";
import StoreInstruction from "./StoreInstruction";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import H1 from "../../typographies/H1";
import SupportImgSvg from "../../help-and-support/assets/SupportImgSvg";

const RegisterStoreMan = ({ configData }) => {
  const router = useRouter();
  /* const previousRouteName = router.query.from; */
  const dispatch = useDispatch();
  const [isApiCalling, setIsApiCalling] = useState(false);
  const theme = useTheme();
  const textColor = theme.palette.whiteContainer.main;
  const { data: zoneList, refetch: zoneRefetch } = useGetZone();
  const [expanded, setExpanded] = React.useState(false);

  const storeManFormik = useFormik({
    initialValues: {
      name: "",
      address: "",
      store_type: "",
      cover_photo: "",
      logo: "",
      zone_id: "",
      module_id: "",
      latitude: "",
      longitude: "",
      f_name: "",
      l_name: "",
      phone: "",
      email: "",
      password: "",
      minimum_delivery_time: "",
      maximum_delivery_time: "",
      delivery_time_type: "",
      subscription_id: "",
      commission_plan_type: "1",
      confirm_password: "",
      flat_percentage: configData?.admin_commission,
      categories: "",
      userZoneCity: "",
      userZoneDistrict: "",
      userZoneState: "",
      userZonePincode: "",
      userAddress: "",
      recaptcha: false,
    },
    validationSchema: StoreManRegisterValidation(),
    onSubmit: async (values, helpers) => {
      try {
        formSubmitHandler(values);
      } catch (err) {
        console.log(err);
      }
    },
  });
  let lanDirection = undefined;

  const { data: subscriptionPlans, refetch: subscriptionPlanRefetch } =
    useGetSubscriptionPlan();

  const [zoneGetList, setZoneGetList] = useState([]);
  const [subscriptionPlanList, setSubscriptionPlanList] = useState([]);
  const [isSubmittedForm, setSubmittedForm] = useState(false);
  const [subscriptionDataFullInfo, setSubscriptionDataFullInfo] = useState([]);
  if (typeof window !== "undefined") {
    lanDirection = JSON.parse(localStorage.getItem("settings"));
  }

  const handleOnChange = (value) => {
    storeManFormik.setFieldValue("phone", `+${value}`);
  };
  const passwordHandler = (value) => {
    storeManFormik.setFieldValue("password", value);
  };

  useEffect(() => {
    let zonesObject = [];

    const fetchData2 = async () => {
      let zones = await zoneRefetch();
      if (zones.data && zones.data?.length > 0) {
        zones.data?.forEach((zone) => {
          let obj = {
            label: zone.name,
            value: zone.id,
          };
          zonesObject.push(obj);
          setZoneGetList(zonesObject);
        });
      }
    };
    fetchData2();
    let PlanList = [];

    const fetchData3 = async () => {
      let plans = await subscriptionPlanRefetch();
      if (plans.data && plans.data?.length > 0) {
        setSubscriptionDataFullInfo(plans.data);
        plans.data?.forEach((plan) => {
          let obj = {
            label:
              plan.name +
              " ( " +
              configData.currency_symbol+
              " " +
              plan.price +
              " ) - " +
              plan.total_frequency +
              plan.frequency +
              " & " +
              plan.no_of_products +
              " Products",
            value: plan.id,
          };
          PlanList.push(obj);
          setSubscriptionPlanList(PlanList);
        });
      }
    };
    fetchData3();
  }, []);

  const onSuccessHandler = (res) => {
    if (res) {
      toast.success(res.message);
      storeManFormik.resetForm();
      storeManFormik.setFieldValue("cover_photo", "");
      storeManFormik.setFieldValue("logo", "");
      setSubmittedForm("");
      router.push("/home");
    }
  };

  const onErrorResponse = (error) => {
    console.log("error:: ", error);
    if (error) {
      error?.response?.data?.errors?.forEach((item) => {
        toast.error(item.message);
      });
    }
  };

  useEffect(() => {
    if (!storeManFormik.isSubmitting) return;
    if (Object.keys(storeManFormik.errors).length > 0) {
      console.log(storeManFormik.errors);
     /*  window.scrollTo(0, 0);
      document.getElementsByName(Object.keys(storeManFormik.errors)[0])[0].focus(); */
    }
  }, [storeManFormik]);

  const { mutate, isLoading } = useRegisterVendor();
  const formSubmitHandler = (values) => {
    const formData = new FormData();
    formData.append("address", values.address);
    formData.append("store_type", values.store_type);
    formData.append("logo", values.logo);
    formData.append("cover_photo", values.cover_photo);
    formData.append("zone_id", values.zone_id);
    formData.append("module_id", values.module_id);
    formData.append("latitude", parseFloat(values.latitude));
    formData.append("longitude", parseFloat(values.longitude));
    formData.append("name", values.name);
    formData.append("f_name", values.f_name);
    formData.append("phone", values.phone);
    formData.append("email", values.email);
    formData.append("minimum_delivery_time", values.minimum_delivery_time);
    formData.append("password", values.password);
    formData.append("l_name", values.l_name);
    formData.append("maximum_delivery_time", values.maximum_delivery_time);
    formData.append("delivery_time_type", values.delivery_time_type);
    formData.append("subscription_id", values.subscription_id);
    formData.append("commission_plan_type", values.commission_plan_type);
    formData.append("flat_percentage", configData?.admin_commission);
    formData.append("categories", values.categories);
    formData.append("userZoneCity", values.userZoneCity);
    formData.append("userZoneDistrict", values.userZoneDistrict);
    formData.append("userZoneState", values.userZoneState);
    formData.append("userZonePincode", values.userZonePincode);
    formData.append("userAddress", values.userAddress);
    formData.append("recaptcha", values.recaptcha);

    //delete values.password;
    //values.confirm_password;
    mutate(formData, {
      onSuccess: onSuccessHandler,
      onError: onErrorResponse,
    });
  };

  const vendorRegister = () => {
    setSubmittedForm(true);
  };
  const handleFormBasedOnDirection = () => (
    <SettingsProvider>
      <SettingsConsumer>
        {(value) => (
          <StoreApplyForm
            configData={configData}
            handleOnChange={handleOnChange}
            passwordHandler={passwordHandler}
            storeManFormik={storeManFormik}
            lanDirection={value?.settings?.direction}
            zoneData={zoneGetList}
            subscriptionPlanData={subscriptionPlanList}
            subscriptionDataFullInfo={subscriptionDataFullInfo}
            isSubmittedForm={isSubmittedForm}
          />
        )}
      </SettingsConsumer>
    </SettingsProvider>
  );
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <>
      <NoSsr>
        <CustomStackFullWidth alignItems="flex-center">
          <H1 text={t("Store Registration")} />
        </CustomStackFullWidth>
        <br></br>
        <Accordion
          className="storeInstruction"
          expanded={
            expanded === configData?.toggle_store_registration || expanded
          }
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography variant="h5">{t("Instructions")}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <StoreInstruction />
            </Typography>
          </AccordionDetails>
        </Accordion>
        {configData?.toggle_store_registration ? (
          <form noValidate onSubmit={storeManFormik.handleSubmit}>
            {handleFormBasedOnDirection()}
            <br></br>
            <CustomStackFullWidth spacing={2}>
              <CustomPaperBigCard
                justifyContent="center"
                style={{ textAlign: "right" }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  onClick={vendorRegister}
                  loading={isApiCalling}
                  sx={{ color: textColor }}
                >
                  {t("Submit")}
                </LoadingButton>
              </CustomPaperBigCard>
            </CustomStackFullWidth>
          </form>
        ) : (
          <CustomStackFullWidth alignItems="flex-center">
            <CustomPaperBigCard
              justifyContent="center"
              style={{ textAlign: "center" }}
            >
              <SupportImgSvg />
              <Typography
                sx={{ fontSize: "32px", fontWeight: "600", marginTop: "15px" }}
              >
                {t("Please Contact Admin For Registration")}
              </Typography>
            </CustomPaperBigCard>
          </CustomStackFullWidth>
        )}
      </NoSsr>
    </>
  );
};

export default RegisterStoreMan;
