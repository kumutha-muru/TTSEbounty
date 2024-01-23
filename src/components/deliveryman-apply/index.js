import React, { useEffect, useState } from "react";
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { NoSsr, useTheme, useMediaQuery, Typography } from "@mui/material";
import DeliverymanApplyForm from "./DeliverymanApplyForm";
import { t } from "i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/router";
import DeliveryManRegisterValidation from "./DeliveryManRegisterValidation";
import { useFormik } from "formik";
import { useRegisterDeliveryMan } from "../../api-manage/hooks/react-query/useRegisterDeliveryMan";
import { SettingsConsumer, SettingsProvider, } from "../../contexts/settings-context";
import useGetVehicles from "../../api-manage/hooks/react-query/useGetVehicles";
import toast from "react-hot-toast";
import SupportImgSvg from "../help-and-support/assets/SupportImgSvg";

const RegisterDeliveryMan = ({ configData }) => {
    const router = useRouter();
    const [isApiCalling, setIsApiCalling] = useState(false);
    const theme = useTheme();
    const textColor = theme.palette.whiteContainer.main;
    const isSmall = useMediaQuery(theme.breakpoints.down("md"));
    const { data: vehiclesList, refetch: vehiclesRefetch } = useGetVehicles();
    
    const deliveryManFormik = useFormik({
        initialValues: {
            f_name: "",
            l_name: "",
            email:"",
            earning:"",
            vehicle_id:"",
            identity_type:"",
            identity_number:"",
            identity_image:"",
            phone:"",
            password:"",
            image:"",
            captcha:""
        },
        validationSchema: DeliveryManRegisterValidation(),
        onSubmit: async (values, helpers) => {
            try {
                formSubmitHandler(values);
            } catch (err) {
                console.log(err);
            }
        },
    });
    const [vehiclesGetList, setVehiclesGetList] = useState([]);

    const handleOnChange = (value) => {
        deliveryManFormik.setFieldValue("phone", `+${value}`);
    };
    const passwordHandler = (value) => {
        deliveryManFormik.setFieldValue("password", value);
    };
    
    useEffect(() => {
        let vehiclesObject = []
        const fetchData3 = async () => {
            let vehicles = await vehiclesRefetch();
            if ( vehicles.data && vehicles.data?.length > 0) {
                vehicles.data?.forEach((vehicle) => {
                  let obj = {
                    label: vehicle.type,
                    value: vehicle.id,
                  };
                  vehiclesObject.push(obj);
                  setVehiclesGetList(vehiclesObject);
                })
            }
        }
        fetchData3();
      },[]);
      
    const onSuccessHandler = (response) => {
        toast.success(response.message);
        deliveryManFormik.resetForm();
        router.push("/home");
    };

    const onErrorResponse = (error) => {
        if (error) {
            let errmsg = [];
            error?.response?.data?.errors?.forEach((item) => {
               errmsg.push(item.message+'\n');
            });
           toast.error(errmsg);
        }
    };
    
    const handleError = () => {
        setIsApiCalling(false);
    };
    
    const { mutate, isLoading } = useRegisterDeliveryMan();
    const formSubmitHandler = (values) => {
        const formData = new FormData();
        formData.append("f_name", values.f_name);
        formData.append("l_name", values.l_name);
        formData.append("email", values.email);
        formData.append("earning", 1);
        formData.append("vehicle_id", values.vehicle_id);
        formData.append("identity_type", values.identity_type);
        formData.append("identity_number", values.identity_number);
        formData.append("identity_image", values.identity_image);
        formData.append("phone", values.phone);
        formData.append("password", values.password);
        formData.append("image", values.image);
        mutate(formData, { 
            onSuccess: onSuccessHandler ,
            onError: onErrorResponse,
        });
    };
    
    const handleFormBasedOnDirection = () => (
        <SettingsProvider>
            <SettingsConsumer>
                {(value) => (
                     <DeliverymanApplyForm
                        configData={configData} 
                        handleOnChange={handleOnChange}
                        passwordHandler={passwordHandler}
                        deliveryManFormik={deliveryManFormik}
                        vehiclesData={vehiclesGetList}
                        identityTypeData={configData.identity_type}
                    />
                )}
            </SettingsConsumer>
        </SettingsProvider>
    );

    useEffect(() => {
        if (!deliveryManFormik.isSubmitting) return;
        if (Object.keys(deliveryManFormik.errors).length > 0) {
            document.getElementsByName(Object.keys(deliveryManFormik.errors)[0])[0].focus();
        }
    }, [deliveryManFormik]);

    return (
      <>
        <NoSsr>
          {configData?.toggle_dm_registration ? (
            <form
              noValidate
              onSubmit={deliveryManFormik.handleSubmit}
              enctype="multipart/form-data"
            >
              {handleFormBasedOnDirection()}
              <br></br>
              <CustomStackFullWidth spacing={2} >
                <CustomPaperBigCard
                  justifyContent="center"
                  style={{ textAlign: "right" }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isApiCalling}
                    sx={{ color: textColor }}
                  >
                    {t("Submit")}
                  </LoadingButton>
                </CustomPaperBigCard>
              </CustomStackFullWidth>
            </form>
          ) : (
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
          )}
        </NoSsr>
      </>
    );
};

export default RegisterDeliveryMan;