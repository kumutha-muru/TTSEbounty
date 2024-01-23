import React from "react";
import { Stack, Typography, Grid, useMediaQuery, useTheme} from "@mui/material";
import {useFormik} from "formik";
import {CustomStackFullWidth} from "../../../styled-components/CustomStyles.style";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import toast from "react-hot-toast";

import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import {useForgotPassword} from "../../../api-manage/hooks/react-query/forgot-password/useForgotPassword";
import {onErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import {forgot_password_header} from "../../../utils/staticTexts";
import {getLanguage} from "../../../helper-functions/getLanguage";

import CustomImageContainer from "../../../components/CustomImageContainer";
import signInImage from "../../../../public/Sign Up.svg";
import AuthHeader from "../AuthHeader";

const ForgotPasswordNumberForm = ({data, goNext, handleFirstForm}) => {
    const {t} = useTranslation();
    const {configData} = useSelector((state) => state.configData);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("md"));
    const phoneFormik = useFormik({
        initialValues: {
            phone: data ? data.phone : "",
        },
        validationSchema: Yup.object({
            phone: Yup.string()
                .required(t("Please give a phone number"))
                .min(10, "number must be 10 digits"),
        }),
        onSubmit: async (values, helpers) => {
            try {
                formSubmitHandler(values);
            } catch (err) {
            }
        },
    });

    const onSuccessHandler = (res) => {
        if (res) {
            if(res?.errors?.length>0){
                goNext();
                toast.error(res?.errors[0].message);
            }else{
                goNext();
                toast.success(res.message);
            }
        }
    };

    const {mutate, isLoading} = useForgotPassword({
        onSuccessHandler,
        onError: (errors) => {
            onErrorResponse(errors);
        },
    });
    const formSubmitHandler = (values) => {
        handleFirstForm(values);
        mutate(values, {onSuccess: onSuccessHandler, onError: onErrorResponse});
    };
    const lanDirection = getLanguage() ? getLanguage() : "ltr";
    const handleOnChange = (value) => {
        phoneFormik.setFieldValue("phone", `+${value}`);
    };
    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
        >
            <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} marginBottom="8rem" >
                <CustomImageContainer
                    width={isSmall ? "700px" : "700px"}
                    height={isSmall ? "100%" : "100%"}
                    objectfit="contained"
                    src={signInImage.src}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} paddingBottom="5rem">
                <p style={{ "fontSize": "20px" }}><AuthHeader configData={configData} title={t("Forget Password")} /></p>
                <CustomStackFullWidth style={{ "width": "80%" }}>
                    <Stack>
                        <Typography style={{ "text-align": "left" }}>{t(forgot_password_header)}</Typography>
                    </Stack>
                    <form noValidate onSubmit={phoneFormik.handleSubmit}>
                        <CustomStackFullWidth mt="2rem">
                            <CustomPhoneInput
                                value={phoneFormik.values.phone}
                                onHandleChange={handleOnChange}
                                initCountry={configData?.country}
                                touched={phoneFormik.touched.phone}
                                errors={phoneFormik.errors.phone}
                                lanDirection={lanDirection}
                            />
                            <LoadingButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                                loading={isLoading}
                            >
                                {t("Next")}
                            </LoadingButton>
                        </CustomStackFullWidth>
                    </form>
                </CustomStackFullWidth>
            </Grid>
        </Grid>
    );
};
export default ForgotPasswordNumberForm;
