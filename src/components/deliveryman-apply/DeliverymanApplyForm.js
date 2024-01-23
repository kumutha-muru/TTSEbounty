import React, { useState, useEffect } from "react";
import Captcha from "demos-react-captcha";
import { t } from "i18next";
import { NoSsr, useTheme, Grid, useMediaQuery } from "@mui/material";
import { FormControl, MenuItem, Select, FormHelperText, TextField } from '@mui/material'
import { CustomStackFullWidth, CustomPaperBigCard } from "../../styled-components/CustomStyles.style";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import H4 from "../typographies/H4";
import ImageThumb from "./ImageThumb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StoreIcon from "@mui/icons-material/Store";
import { Stack } from "@mui/system";
import FormLabel from '@mui/material/FormLabel';
import CustomPhoneInput from "../custom-component/CustomPhoneInput";
import { getLanguage } from "../../helper-functions/getLanguage";

const DeliverymanApplyForm = ({deliveryManFormik, configData, nameHandler, vehiclesData, identityTypeData, emailHandler, passwordHandler}) => {
  const lanDirection = getLanguage() || "ltr";
  const theme = useTheme();
  const [isUploadIdentityImage, setIsUploadIdentityImage] = useState('');
  const [isUploadDeliveryManImage, setIsUploadDeliveryManImage] = useState('');
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [checkRecaptcha, IscheckRecaptcha] = useState(false);
  const [delmanInvalidImg, setDelmanInvalidImg] = useState('');
  const [identityImgInvalidImg, setIdentityImgInvalidImg] = useState('');

  const formLabelStyle = ()=>{
    return getLanguage() === "rtl"
                      ? { textAlign: "right" }
                      : { textAlign: "left" }
   } 
  
  const numberHandler = (value) => {
    deliveryManFormik.setFieldValue("phone", value);
  };

  const handleEarning = (e) => {
    deliveryManFormik.setFieldValue("earning", e);
  };

  const handleVehicle = (e) => {
    deliveryManFormik.setFieldValue("vehicle_id", e);
  };

  const handleIdentityType = (e) => {
    deliveryManFormik.setFieldValue("identity_type", e);
  };
  return (
    <>
      <NoSsr>
        <CustomStackFullWidth alignItems="flex-center">
          <p id="deliveryman-title">{t('Deliveryman Registration')}</p>
          <CustomPaperBigCard justifyContent="center" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <StoreIcon /><H4 text={t('Deliveryman Info')} />
            </Stack>
            <br/>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} >
                <FormControl fullWidth>
                  <FormLabel style={formLabelStyle()} required="true">{t('First Name')}</FormLabel>
                  <CustomTextFieldWithFormik
                    autoComplete="off"
                    type="text"
                    placeholder={t("First Name")}
                    touched={deliveryManFormik.touched.f_name}
                    errors={deliveryManFormik.errors.f_name}
                    fieldProps={deliveryManFormik.getFieldProps("f_name")}
                    onChangeHandler={nameHandler}
                    value={deliveryManFormik.values.f_name}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} >
                <FormControl fullWidth>
                  <FormLabel style={formLabelStyle()} required="true">{t('Last Name')}</FormLabel>
                  <CustomTextFieldWithFormik autoComplete="off"
                    type="text"
                    placeholder={t("Last Name")}
                    touched={deliveryManFormik.touched.l_name}
                    errors={deliveryManFormik.errors.l_name}
                    fieldProps={deliveryManFormik.getFieldProps("l_name")}
                    onChangeHandler={nameHandler}
                    value={deliveryManFormik.values.l_name}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br/>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} >
                <FormControl fullWidth>
                  <FormLabel style={formLabelStyle()} required="true">{t('Email')}</FormLabel>
                  <CustomTextFieldWithFormik autoComplete="off"
                    type="text"
                    placeholder={t("Ex: ex@example.com")}
                    touched={deliveryManFormik.touched.email}
                    errors={deliveryManFormik.errors.email}
                    fieldProps={deliveryManFormik.getFieldProps("email")}
                    onChangeHandler={nameHandler}
                    value=''
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} >
                <FormControl fullWidth>
                  <FormLabel style={formLabelStyle()} required="true">{t('Deliveryman Type')}</FormLabel>
                  <Select
                    id="deliveryman-select"
                    value={1}
                    readOnly
                    onChange={e => { handleEarning(e.target.value); }}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    touched={deliveryManFormik.touched.earning}
                    errors={deliveryManFormik.errors.earning}
                    fieldProps={deliveryManFormik.getFieldProps("earning")}
                  >
                    <MenuItem value=""><em>{t('Select Deliveryman Type')}</em></MenuItem>
                    <MenuItem value={1}>{t("Freelancer")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br/>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} >
              <FormControl fullWidth>
                  <FormLabel style={formLabelStyle()} required="true">{t('Vehicle')}</FormLabel>
                  <Select
                    id="deliveryman-select"
                    fullWidth
                    value={deliveryManFormik.values.vehicle_id}
                    onChange={e => { handleVehicle(e.target.value); }}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    touched={deliveryManFormik.touched.vehicle_id}
                    errors={deliveryManFormik.errors.vehicle_id}
                    fieldProps={deliveryManFormik.getFieldProps("vehicle_id")}
                  >
                    <MenuItem value=""><em>{t('Select Vehicle')}</em></MenuItem>
                    {vehiclesData?.length > 0 && vehiclesData.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.value} sx={{ '&:hover': { backgroundColor: 'primary.main' } }}>
                          {t(item.label)}
                        </MenuItem>
                      )
                    })}
                    { vehiclesData?.length === 0 && <MenuItem>{t('No Records')}</MenuItem> }
                  </Select>
                  {deliveryManFormik.touched.vehicle_id && deliveryManFormik.touched.vehicle_id && !deliveryManFormik.values.vehicle_id && (
                    <FormHelperText sx={{ color: (theme) => theme.palette.error.main }} >
                      {t('The vehicle field is required!')}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} >
                <FormControl fullWidth>
                  <FormLabel style={formLabelStyle()} required="true">{t('Identity Type')}</FormLabel>
                  <Select
                    id="deliveryman-select"
                    value={deliveryManFormik.values.identity_type}
                    onChange={e => { handleIdentityType(e.target.value); }}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    touched={deliveryManFormik.touched.identity_type}
                    errors={deliveryManFormik.errors.identity_type}
                    fieldProps={deliveryManFormik.getFieldProps("identity_type")}
                  >
                    <MenuItem value=""><em>{t('Select Identity Type')}</em></MenuItem>
                    { identityTypeData?.length > 0 && identityTypeData.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.key} sx={{ '&:hover': { backgroundColor: 'primary.main' } }}>
                          {t(item.value)}
                        </MenuItem>
                      )
                    }) }
                    { identityTypeData?.length === 0 && <MenuItem>{t('No Records')}</MenuItem> }
                  </Select>
                  {deliveryManFormik.touched.identity_type && deliveryManFormik.touched.identity_type && !deliveryManFormik.values.identity_type && (
                    <FormHelperText sx={{ color: (theme) => theme.palette.error.main }} >
                      {t('The identity type is required!')}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <br/>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} >
                <FormControl fullWidth>
                  <FormLabel style={formLabelStyle()} required="true">{t('Identity Number')}</FormLabel>
                  <CustomTextFieldWithFormik autoComplete="off"
                    type="text"
                    placeholder={t("Identity Number")}
                    touched={deliveryManFormik.touched.identity_number}
                    errors={deliveryManFormik.errors.identity_number}
                    fieldProps={deliveryManFormik.getFieldProps("identity_number")}
                    onChangeHandler={nameHandler}
                    value={deliveryManFormik.values.identity_number}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12} spacing={1} align={isSmall ? "right" : "right"} style={{ "display": "flex", "justifycontent": "space-between" }}>
                <ImageThumb file={isUploadIdentityImage} type="identityimage" />
              </Grid>
              <Grid item xs={12} sm={12} md={12} spacing={1} align={isSmall ? "right" : "right"} style={{ "display": "flex", "justifycontent": "space-between" }}>
                <FormControl>
                  <FormLabel style={formLabelStyle()} required="true">{t("Identity Image")}</FormLabel>
                  <TextField autoComplete="off"
                    fullWidth
                    type="file"
                    placeholder={t("Identity Image")}
                    inputProps={{accept:"image/*"}}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type=='image/png' || e.target.files[0].type=='image/jpeg' || e.target.files[0].type=='image/jpg')) {
                        setIsUploadIdentityImage(URL.createObjectURL(e.target?.files[0]));
                        deliveryManFormik.setFieldValue("identity_image", e.target?.files[0]);
                      } else {
                        setIsUploadIdentityImage('');
                        deliveryManFormik.setFieldValue("identity_image", '');
                        setIdentityImgInvalidImg(true);
                      }
                    }}
                    touched={deliveryManFormik.touched.identity_image}
                    errors={deliveryManFormik.errors.identity_image}
                    fieldProps={deliveryManFormik.getFieldProps("identity_image")}
                  />
                  {deliveryManFormik.touched.identity_image && deliveryManFormik.touched.identity_image && !deliveryManFormik.values.identity_image && !identityImgInvalidImg && (
                    <FormHelperText sx={{ color: (theme) => theme.palette.error.main }} >
                      {t('The identity image field is required')}
                    </FormHelperText>
                  )}
                  {identityImgInvalidImg && <FormHelperText sx={{ color: (theme) => theme.palette.error.main }} >Only jpg and png files are allowed</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
            <br/>
          </CustomPaperBigCard>
          <br/>
          <CustomPaperBigCard justifyContent="center" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccountCircleIcon /><H4 text={t('Login Info')}/>
            </Stack>
            <br/>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} >
                <FormControl fullWidth>
                  <FormLabel style={formLabelStyle()} required="true">{t('Phone')}</FormLabel>
                  {/* <CustomTextFieldWithFormik autoComplete="off"
                    type="text"
                    placeholder={t("Phone")}
                    touched={deliveryManFormik.touched.phone}
                    errors={deliveryManFormik.errors.phone}
                    fieldProps={deliveryManFormik.getFieldProps("phone")}
                    onChangeHandler={numberHandler}
                    value={deliveryManFormik.values.phone}
                  /> */}
                  <CustomPhoneInput
                   value={deliveryManFormik.values.phone}
                   onHandleChange={numberHandler}
                   initCountry={configData?.country}
                   touched={deliveryManFormik.touched.phone}
                   errors={deliveryManFormik.errors.phone}
                   lanDirection={lanDirection}/>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} align={isSmall ? "right" : "right"} >
                <FormControl fullWidth>
                  <FormLabel style={formLabelStyle()} required="true">{t('Password')}</FormLabel>
                  <CustomTextFieldWithFormik autocomplete="new-password"
                    type="password"
                    placeholder={t("Password")}
                    touched={deliveryManFormik.touched.password}
                    errors={deliveryManFormik.errors.password}
                    fieldProps={deliveryManFormik.getFieldProps("password")}
                    onChangeHandler={passwordHandler}
                    value={deliveryManFormik.values.password}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12} spacing={1} align={isSmall ? "right" : "right"} style={{ "display": "flex", "justifycontent": "space-between" }}>
                <ImageThumb file={isUploadDeliveryManImage} type="deliverymanimage" />
              </Grid>
              <Grid item xs={12} sm={12} md={12} spacing={1} align={isSmall ? "right" : "right"} style={{ "display": "flex", "justifycontent": "space-between" }}>
                <FormControl>
                  <FormLabel style={formLabelStyle()} required="true">{t("Deliveryman Image")}</FormLabel>
                  <TextField autoComplete="off"
                    fullWidth
                    type="file"
                    inputProps={{accept:"image/*"}}
                    placeholder={t("Deliveryman Image")}
                    label={t("")}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type=='image/png' || e.target.files[0].type=='image/jpeg' || e.target.files[0].type=='image/jpg')) {
                        setIsUploadDeliveryManImage(URL.createObjectURL(e.target?.files[0]));
                        deliveryManFormik.setFieldValue("image", e.target?.files[0]);
                      } else {
                        setIsUploadDeliveryManImage('');
                        deliveryManFormik.setFieldValue("image", '');
                        setDelmanInvalidImg(true);
                      }
                    }}
                    touched={deliveryManFormik.touched.image}
                    errors={deliveryManFormik.errors.image}
                    fieldProps={deliveryManFormik.getFieldProps("image")}
                  />
                  {deliveryManFormik.touched.image && deliveryManFormik.touched.image && !deliveryManFormik.values.image && !delmanInvalidImg && (
                    <FormHelperText sx={{ color: (theme) => theme.palette.error.main }} >
                      {t('Deliveryman image is required')}
                    </FormHelperText>
                  )}
                  {delmanInvalidImg && <FormHelperText sx={{ color: (theme) => theme.palette.error.main }} >Only jpg and png files are allowed</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} >
                <Captcha
                  placeholder={t("Enter captcha")} /* optional */
                  length={6} /* default */
                  char={(1, 2, 3, 4, 5, 6, 7, 8, 9)}
                  onChange={(e) => {
                    IscheckRecaptcha(e);
                    deliveryManFormik.setFieldValue("captcha", e);
                  }}
                  touched={deliveryManFormik.touched.captcha}
                  errors={deliveryManFormik.errors.captcha}
                  fieldProps={deliveryManFormik.getFieldProps("captcha")}
                />
                {deliveryManFormik.touched.captcha && deliveryManFormik.touched.captcha && !deliveryManFormik.values.captcha && (
                    <FormHelperText sx={{ color: (theme) => theme.palette.error.main }} >
                      {t('Captcha is required')}
                    </FormHelperText>
                  )}
              </Grid>
            </Grid>
          </CustomPaperBigCard>
        </CustomStackFullWidth>
      </NoSsr>
    </>

  );
};

export default DeliverymanApplyForm;
