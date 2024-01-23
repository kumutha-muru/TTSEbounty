import React, { useState, useEffect } from "react";
import Captcha from "demos-react-captcha";
import { t } from "i18next";
import {
  Checkbox,
  FormControlLabel,
  NoSsr,
  Typography,
  useTheme,
  Grid,
  useMediaQuery,
  TextField,
  FormControl,
  MenuItem,
  Select,
  FormHelperText,
  ListSubheader,
} from "@mui/material";
import {
  CustomPaperBigCard,
  CustomBoxFullWidth,
} from "../../../styled-components/CustomStyles.style";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import { getLanguage } from "../../../helper-functions/getLanguage";
import GoogeMapStore from "./GoogeMapStore";
import ImageThumb from "./ImageThumb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StoreIcon from "@mui/icons-material/Store";
import { Stack } from "@mui/system";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import ListItemText from "@mui/material/ListItemText";
import useGetModule from "../../../api-manage/hooks/react-query/useGetModule";
import useGetSubCategoryByModule from "../../../api-manage/hooks/react-query/categories-details/useGetSubCategoryByModule";
import useGetGeoCode from "../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import toast from "react-hot-toast";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";

const StoreApplyForm = ({
  storeManFormik,
  isSubmittedForm,
  configData,
  subscriptionDataFullInfo,
  handleOnChange,
  nameHandler,
  zoneData,
  subscriptionPlanData,
  addressHandler,
  longitudeHandler,
  latitudeHandler,
  emailHandler,
  passwordHandler,
  confirmPasswordHandler,
}) => {
  const theme = useTheme();
  const lanDirection = getLanguage() || "ltr";
  const [isUploadCoverPhoto, setIsUploadCoverPhoto] = useState("");
  const [isUploadStoreLogo, setIsUploadStoreLogo] = useState("");
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [checkRecaptcha, IscheckRecaptcha] = useState(false);
  const [isZoneValue, setIsZoneValue] = useState("");
  const [selectedPlan, setSelectedPlan] = useState({});
  const [categoryItems, setCategoryItems] = React.useState([]);

  const [moduleGetList, setModuleGetList] = useState([]);
  const [categories, setcategories] = useState([]);
  const [moduleFilterId, setModuleFilterId] = useState("");
  const [categoryFilterId, setCategoryFilterId] = useState("");
  const [zonelattitude, setZoneLattitude] = useState({});
  const [invalidLogo, setInvalidLogo] = useState("");
  const [invalidCoverPhoto, setInvalidCoverPhoto] = useState("");
  const [isSubcategory, setIsSubcategory] = useState(true);
  const { refetch: moduleRefetch } =
    useGetModule(moduleFilterId);
  const {
    data: geoCodeResults
  } = useGetGeoCode(zonelattitude, true);
  const formLabelStyle = () => {
    return getLanguage() === "rtl"
      ? { textAlign: "right" }
      : { textAlign: "left" };
  };
  const checkboxLabelAlignMent = () => {
    return getLanguage() === "rtl"
      ? { marginLeft: "0px" }
      : { marginLeft: "-16px" };
  };
  useEffect(() => {
    if (geoCodeResults) {
      if (geoCodeResults.results && geoCodeResults.results?.length > 0) {
        let address_components = geoCodeResults.results[0].address_components;
        storeManFormik.setFieldValue(
          "userZoneCity",
          address_components[address_components.length - 5].long_name
        );
        storeManFormik.setFieldValue(
          "userZoneDistrict",
          address_components[address_components.length - 4].long_name
        );
        storeManFormik.setFieldValue(
          "userZoneState",
          address_components[address_components.length - 3].long_name
        );
        storeManFormik.setFieldValue(
          "userZonePincode",
          address_components[address_components.length - 1].long_name
        );
        storeManFormik.setFieldValue(
          "address",
          geoCodeResults.results[0].formatted_address
        );
      }
    }
  }, [geoCodeResults]);

  const { refetch: subcategoryByModuleRefetch } =
    useGetSubCategoryByModule(categoryFilterId);

  const subCategorylist = (event) => {
    let filtered = categories.map((obj) => {
      if (obj.childes?.length > 0) {
        return {
          [obj.id.toString()]: obj.childes
            .filter((catgy) => event.target.value.includes(catgy.id))
            .map((res) => {
              let temp = [];
              temp.push(res.id);
              return temp;
            }),
        };
      }
    });
    return filtered;
  };
  const handleSubCategory = (event) => {
    if (categories?.length > 0) {
      const filterCategory = subCategorylist(event);
      const filteredArray = filterCategory.reduce((accum, element) => {
        if (element !== undefined) accum.push(element);
        return accum;
      }, []);
      const outputObject = {};
      filteredArray.forEach((item) => {
        for (const key in item) {
          if (item[key].length > 0) {
            const values = item[key].map((arr) => arr.join(",")).join(",");
            outputObject[key.toString()] = values;
          }
        }
      });
      const outputObjectValue =
        Object.keys(outputObject).length === 0
          ? ""
          : JSON.stringify(outputObject);
      storeManFormik.setFieldValue("categories", outputObjectValue);
      setCategoryItems(
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
    }
  };

  const checkSubcategory = () => {
    if (!storeManFormik.values.module_id) {
      setIsSubcategory(false);
    } else if (storeManFormik.values.module_id) {
      setIsSubcategory(true);
    }
  };

  const handleRecaptchaChange = (value) => {
    IscheckRecaptcha(value);
    storeManFormik.setFieldValue("recaptcha", value);
  };

  const handleZone = (e) => {
    storeManFormik.setFieldValue("zone_id", e);
    setIsZoneValue(e);
    localStorage.setItem("Store-Z-id", e);
  };

  const handleModule = (e) => {
    storeManFormik.setFieldValue("module_id", e);
    if (e) setIsSubcategory(true);
  };

  const storeTypeHandler = (e) => {
    storeManFormik.setFieldValue("store_type", e.target.value);
  };

  const commission_plan_typeHandler = (e) => {
    storeManFormik.setFieldValue("commission_plan_type", e.target.value);
    storeManFormik.setFieldValue("subscription_id", "");
    setCategoryItems(null);
  };

  const handleSubscriptionPlans = (e) => {
    storeManFormik.setFieldValue("subscription_id", e);
    const filtered = subscriptionDataFullInfo.filter((obj) => {
      return obj.id === e;
    });
    setSelectedPlan(filtered);
  };

  const handleCoordinatesCallback = async (childData) => {
    setZoneLattitude(childData);
    storeManFormik.setFieldValue("latitude", childData.lat);
    storeManFormik.setFieldValue("longitude", childData.lng);
  };

  const filterModule = async (value) => {
    setModuleGetList(null);
    setModuleFilterId(value);
    storeManFormik.setFieldValue("zone_id", value);
  };

  useEffect(() => {
    const filtermodules = async () => {
      let modulesObject = [];
      let modules = await moduleRefetch();
      if (modules.data && modules.data?.length > 0) {
        toast.dismiss();
        modules.data?.forEach((modu) => {
          let obj = {
            label: modu.module_name,
            value: modu.id,
          };
          modulesObject.push(obj);
          setModuleGetList(modulesObject);
        });
      } else if (moduleFilterId) {
        toast.error("This zone has no module");
        return false;
      }
    };
    filtermodules();
  }, [moduleFilterId]);

  useEffect(() => {
    const filtercategories = async () => {
      let subcategoriesBySubscriptionPlan = await subcategoryByModuleRefetch();
      if (
        subcategoriesBySubscriptionPlan.data &&
        subcategoriesBySubscriptionPlan.data?.length > 0
      ) {
        toast.dismiss();
        setcategories(subcategoriesBySubscriptionPlan.data);
      } else if (categoryFilterId) {
        toast.error("This Module has no category");
      }
    };
    filtercategories();
  }, [categoryFilterId]);

  const filterSubCategory = async (value) => {
    setCategoryFilterId(value);
    setcategories(null);
    storeManFormik.setFieldValue("module_id", value);
  };

  const handleDeliveryTimeType = async (value) => {
    storeManFormik.setFieldValue("delivery_time_type", value);
  };
  return (
    <NoSsr>
      <CustomPaperBigCard
        justifyContent="center"
        alignItems="center"
        style={{ "margin-top": "20px" }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <StoreIcon />
          <Typography variant="h5">{t("Store Info")}</Typography>
        </Stack>
        <Grid
          container
          rowSpacing={4}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ "margin-top": "1px" }}
        >
          <Grid item xs={12} sm={12} md={6}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Name")}
              </FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                placeholder={t("Store_Name")}
                touched={storeManFormik.touched.name}
                errors={storeManFormik.errors.name}
                fieldProps={storeManFormik.getFieldProps("name")}
                onChangeHandler={nameHandler}
                value={storeManFormik.values.name}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <FormControl>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Approx_Delivery_Time")}
              </FormLabel>
              <Grid container spacing={3}>
                <Grid item spacing={1} width="30%">
                  <CustomTextFieldWithFormik
                    autoComplete="off"
                    type="number"
                    placeholder={t("Min")}
                    touched={storeManFormik.touched.minimum_delivery_time}
                    errors={storeManFormik.errors.minimum_delivery_time}
                    fieldProps={storeManFormik.getFieldProps(
                      "minimum_delivery_time"
                    )}
                    value={storeManFormik.values.minimum_delivery_time}
                  />
                </Grid>
                <Grid item spacing={1} width="30%">
                  <CustomTextFieldWithFormik
                    autoComplete="off"
                    type="number"
                    placeholder={t("Max")}
                    touched={storeManFormik.touched.maximum_delivery_time}
                    errors={storeManFormik.errors.maximum_delivery_time}
                    fieldProps={storeManFormik.getFieldProps(
                      "maximum_delivery_time"
                    )}
                    value={storeManFormik.values.maximum_delivery_time}
                  />
                </Grid>

                <Grid item spacing={1} width="40%">
                  <Select
                    required="true"
                    placeholder={t("Select_Delivery_Time_Type")}
                    fullWidth
                    onChange={(e) => {
                      handleDeliveryTimeType(e.target.value);
                    }}
                    displayEmpty
                    value={storeManFormik.values.delivery_time_type}
                    touched={storeManFormik.touched.delivery_time_type}
                    errors={storeManFormik.errors.delivery_time_type}
                    fieldProps={storeManFormik.getFieldProps(
                      "delivery_time_type"
                    )}
                  >
                    <MenuItem value="">
                      <em>{t("Select_Delivery_Time_Type")}</em>
                    </MenuItem>
                    <MenuItem value="Minutes">
                      <em>{t("Minutes")}</em>
                    </MenuItem>
                    <MenuItem value="Hours">{t("Hours")}</MenuItem>
                    <MenuItem value="Days">{t("Days")}</MenuItem>
                  </Select>
                  {storeManFormik.touched.delivery_time_type &&
                    !storeManFormik.values.delivery_time_type && (
                      <FormHelperText
                        sx={{ color: (theme) => theme.palette.error.main }}
                      >
                        {t("please_select_deliver_type")}
                      </FormHelperText>
                    )}
                </Grid>
              </Grid>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              spacing={1}
              style={{ display: "flex", justifycontent: "space-between" }}
            >
              <ImageThumb file={isUploadCoverPhoto} type="coverphoto" />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              spacing={1}
              style={{ display: "flex", justifycontent: "space-between" }}
            >
              <FormControl>
                <FormLabel style={formLabelStyle()} required="true">
                  {t("Upload_Cover_Photo_Ratio_2_1")}
                </FormLabel>
                <TextField
                  autoComplete="off"
                  required="true"
                  fullWidth
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  placeholder={t("")}
                  onChange={(e) => {
                    if (
                      e.target.files &&
                      e.target.files.length > 0 &&
                      (e.target.files[0].type == "image/png" ||
                        e.target.files[0].type == "image/jpeg" ||
                        e.target.files[0].type == "image/jpg")
                    ) {
                      setIsUploadCoverPhoto(
                        URL.createObjectURL(e.target?.files[0])
                      );
                      storeManFormik.setFieldValue(
                        "cover_photo",
                        e.target?.files[0]
                      );
                      setInvalidCoverPhoto(false);
                    } else {
                      setIsUploadCoverPhoto("");
                      storeManFormik.setFieldValue("cover_photo", "");
                      setInvalidCoverPhoto(true);
                    }
                  }}
                  touched={storeManFormik.touched.cover_photo}
                  errors={storeManFormik.errors.cover_photo}
                  fieldProps={storeManFormik.getFieldProps("cover_photo")}
                />
                {storeManFormik.touched.cover_photo &&
                  !storeManFormik.values.cover_photo &&
                  !invalidCoverPhoto && (
                    <FormHelperText
                      sx={{ color: (theme) => theme.palette.error.main }}
                    >
                      {t("Cover photo is required")}
                    </FormHelperText>
                  )}
                {invalidCoverPhoto && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    Only jpg and png files are allowed
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              spacing={1}
              style={{ display: "flex", justifycontent: "space-between" }}
            >
              <ImageThumb file={isUploadStoreLogo} type="storelogo" />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              spacing={1}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <FormControl>
                <FormLabel style={formLabelStyle()} required="true">
                  {t("Upload_Store_Logo_Ratio_1_1")}
                </FormLabel>
                <TextField
                  autoComplete="off"
                  fullWidth
                  type="file"
                  placeholder={t("")}
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) => {
                    if (
                      e.target.files &&
                      e.target.files.length > 0 &&
                      (e.target.files[0].type == "image/png" ||
                        e.target.files[0].type == "image/jpeg" ||
                        e.target.files[0].type == "image/jpg")
                    ) {
                      setIsUploadStoreLogo(
                        URL.createObjectURL(e.target.files[0])
                      );
                      storeManFormik.setFieldValue("logo", e.target.files[0]);
                      setInvalidLogo(false);
                    } else {
                      setIsUploadStoreLogo("");
                      storeManFormik.setFieldValue("logo", "");
                      setInvalidLogo(true);
                    }
                  }}
                  touched={storeManFormik.touched.logo}
                  errors={storeManFormik.errors.logo}
                  fieldProps={storeManFormik.getFieldProps("logo")}
                />
                {storeManFormik.touched.logo &&
                  storeManFormik.touched.logo &&
                  !storeManFormik.values.logo &&
                  !invalidLogo && (
                    <FormHelperText
                      sx={{ color: (theme) => theme.palette.error.main }}
                    >
                      {t("Logo is required")}
                    </FormHelperText>
                  )}
                {invalidLogo && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    Only jpg and png files are allowed
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <CustomBoxFullWidth>
              <FormControl fullWidth>
                <FormLabel style={formLabelStyle()} required="true">
                  {t("Zone")}
                </FormLabel>
                {/*  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: (theme) => theme.palette.neutral[1000] }}
                  >
                    {storeManFormik.values.categories ? "" : ""}
                    </InputLabel> */}
                <Select
                  id="demo-simple-select-label"
                  value={storeManFormik.values.zone_id}
                  displayEmpty
                  onChange={(e) => {
                    handleZone(e.target.value);
                    filterModule(e.target.value);
                  }}
                  touched={storeManFormik.touched.zone_id}
                  errors={storeManFormik.errors.zone_id}
                  fieldProps={storeManFormik.getFieldProps("zone_id")}
                >
                  <MenuItem value="">
                    <em>{t("Select_Zone")}</em>
                  </MenuItem>

                  {zoneData?.length > 0 &&
                    zoneData.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          value={item.value}
                          sx={{
                            "&:hover": {
                              backgroundColor: "primary.main",
                            },
                          }}
                        >
                          {t(item.label)}
                        </MenuItem>
                      );
                    })}
                  {zoneData?.length === 0 && (
                    <MenuItem href="/storeApply">No Records</MenuItem>
                  )}
                </Select>
                {storeManFormik.touched.zone_id &&
                  storeManFormik.touched.zone_id &&
                  !storeManFormik.values.zone_id && (
                    <FormHelperText
                      sx={{ color: (theme) => theme.palette.error.main }}
                    >
                      {t("Please choose zone")}
                    </FormHelperText>
                  )}
              </FormControl>
            </CustomBoxFullWidth>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <CustomBoxFullWidth>
              <FormControl fullWidth>
                <FormLabel style={formLabelStyle()} required="true">
                  {t("System_Module")}
                </FormLabel>
                {/*  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: (theme) => theme.palette.neutral[1000] }}
                  >
                    {storeManFormik.values.module_id ? "" : ""}
                  </InputLabel> */}
                <Select
                  value={storeManFormik.values.module_id}
                  displayEmpty
                  onChange={(e) => {
                    handleModule(e.target.value);
                    filterSubCategory(e.target.value);
                  }}
                  touched={storeManFormik.touched.module_id}
                  errors={storeManFormik.errors.module_id}
                  fieldProps={storeManFormik.getFieldProps("module_id")}
                  disabled={!storeManFormik.values.zone_id}
                >
                  <MenuItem value="">
                    <em>{t("Select_Module")}</em>
                  </MenuItem>
                  {moduleGetList?.length > 0 &&
                    moduleGetList.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          value={item.value}
                          sx={{
                            "&:hover": {
                              backgroundColor: "primary.main",
                            },
                          }}
                        >
                          {t(item.label)}
                        </MenuItem>
                      );
                    })}
                  {moduleGetList?.length === 0 && (
                    // <MenuItem href="/storeApply">No Records</MenuItem>
                    <MenuItem>No Records</MenuItem>
                  )}
                </Select>
                {storeManFormik.touched.module_id &&
                  !storeManFormik.values.module_id && (
                    <FormHelperText
                      sx={{ color: (theme) => theme.palette.error.main }}
                    >
                      {t("Please choose module")}
                    </FormHelperText>
                  )}
              </FormControl>
            </CustomBoxFullWidth>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            align={
              getLanguage() === "rtl" ? isSmall || "right" : isSmall || "left"
            }
          >
            <FormControl>
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                required="true"
              >
                {t("Store_Type")}
              </FormLabel>
              <RadioGroup
                required="true"
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                placeholder={t("")}
                onChange={storeTypeHandler}
                value={storeManFormik.values.store_type}
                touched={storeManFormik.touched.store_type}
                errors={storeManFormik.errors.store_type}
                fieldProps={storeManFormik.getFieldProps("store_type")}
              >
                <Grid container spacing={1} paddingRight="10px">
                  <Grid item spacing={1}>
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      placeholder={t("wholesale")}
                    />
                    <span style={checkboxLabelAlignMent()}>
                      {t("wholesale")}
                    </span>
                  </Grid>
                  <Grid item spacing={1}>
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      placeholder="retail"
                    />
                    <span style={checkboxLabelAlignMent()}>{t("retail")}</span>
                  </Grid>
                </Grid>
              </RadioGroup>
              {storeManFormik.touched.store_type &&
                storeManFormik.errors.store_type &&
                !storeManFormik.values.store_type && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {t("Please choose store type")}
                  </FormHelperText>
                )}
            </FormControl>
          </Grid>
        </Grid>
      </CustomPaperBigCard>
      <br></br>
      <CustomPaperBigCard justifyContent="center" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountCircleIcon />
          <Typography variant="h5">{t("Address_Info")}</Typography>
          <Typography component="span" fontSize="16px" ml="5px">
            {t("Address_Note")}
          </Typography>
        </Stack>
        <Grid
          container
          rowSpacing={4}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ "margin-top": "1px" }}
        >
          <Grid item xs={12} sm={12} md={12}>
            <GoogeMapStore
              zoneValue={isZoneValue}
              parentCallback={handleCoordinatesCallback}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Address")}
              </FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                placeholder={t("Store")}
                touched={storeManFormik.touched.address}
                errors={storeManFormik.errors.address}
                fieldProps={storeManFormik.getFieldProps("address")}
                onChangeHandler={addressHandler}
                value={storeManFormik.values.address}
                disabled={true}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Latitude")}
              </FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                disabled={true}
                touched={storeManFormik.touched.latitude}
                errors={storeManFormik.errors.latitude}
                fieldProps={storeManFormik.getFieldProps("latitude")}
                onChangeHandler={latitudeHandler}
                value={storeManFormik.values.latitude}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Longitude")}
              </FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                disabled={true}
                touched={storeManFormik.touched.longitude}
                errors={storeManFormik.errors.longitude}
                fieldProps={storeManFormik.getFieldProps("longitude")}
                onChangeHandler={longitudeHandler}
                value={storeManFormik.values.longitude}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()}>{t("City")}</FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                disabled={true}
                fieldProps={storeManFormik.getFieldProps("userZoneCity")}
                value={storeManFormik.values.userZoneCity}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()}>{t("District")}</FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                disabled={true}
                fieldProps={storeManFormik.getFieldProps("userZoneDistrict")}
                value={storeManFormik.values.userZoneDistrict}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()}>{t("State")}</FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                disabled={true}
                fieldProps={storeManFormik.getFieldProps("userZoneState")}
                value={storeManFormik.values.userZoneState}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()}>{t("Pincode")}</FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                disabled={true}
                fieldProps={storeManFormik.getFieldProps("userZonePincode")}
                value={storeManFormik.values.userZonePincode}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CustomPaperBigCard>
      <br></br>
      <CustomPaperBigCard justifyContent="center" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountCircleIcon />
          <Typography variant="h5">{t("Owner_Info")}</Typography>
        </Stack>
        <Grid
          container
          rowSpacing={4}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ "margin-top": "1px" }}
        >
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("First_Name")}
              </FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                placeholder={t("First_Name")}
                touched={storeManFormik.touched.f_name}
                errors={storeManFormik.errors.f_name}
                fieldProps={storeManFormik.getFieldProps("f_name")}
                onChangeHandler={nameHandler}
                value={storeManFormik.values.f_name}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Last_Name")}
              </FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                type="text"
                placeholder={t("Last_Name")}
                touched={storeManFormik.touched.l_name}
                errors={storeManFormik.errors.l_name}
                fieldProps={storeManFormik.getFieldProps("l_name")}
                onChangeHandler={nameHandler}
                value={storeManFormik.values.l_name}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Phone")}
              </FormLabel>
              {/* <CustomTextFieldWithFormik autoComplete="off"
                  placeholder={storeManFormik.values.phone ? "" : t("Phone")}
                  touched={storeManFormik.touched.phone}
                  errors={storeManFormik.errors.phone}
                  fieldProps={storeManFormik.getFieldProps("phone")}
                  onChangeHandler={handleOnChange}
                  value={storeManFormik.values.phone}
                /> */}

              <CustomPhoneInput
                value={storeManFormik.values.phone}
                onHandleChange={handleOnChange}
                initCountry={configData?.country}
                touched={storeManFormik.touched.phone}
                errors={storeManFormik.errors.phone}
                lanDirection={lanDirection}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CustomPaperBigCard>
      <br></br>

      <CustomPaperBigCard justifyContent="center" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountCircleIcon />
          <Typography variant="h5">{t("Subscription_Info")}</Typography>
        </Stack>

        <Grid
          container
          rowSpacing={4}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ "margin-top": "1px" }}
        >
          <Grid item xs={12} sm={12} md={12} align={isSmall || "center"}>
            <FormControl>
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                required="true"
              >
                {t("Commission_Type")}
              </FormLabel>
              <RadioGroup
                required="true"
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                onChange={commission_plan_typeHandler}
                value={storeManFormik.values.commission_plan_type}
                touched={storeManFormik.touched.commission_plan_type}
                errors={storeManFormik.errors.commission_plan_type}
                fieldProps={storeManFormik.getFieldProps(
                  "commission_plan_type"
                )}
              >
                <Grid container spacing={1}>
                  <Grid item spacing={1}>
                    <FormControlLabel
                      style={{ margin: "0" }}
                      value="1"
                      control={<Radio />}
                      placeholder={t("Subscription_Plan")}
                    />
                    {t("Subscription_Plan")}
                  </Grid>
                  <Grid item spacing={1}>
                    <FormControlLabel
                      style={{ margin: "0" }}
                      value="2"
                      control={<Radio />}
                      placeholder={t("Flat_Percentage")}
                    />
                    {t("Flat_Percentage")}
                  </Grid>
                  <Grid item spacing={1}>
                    <FormControlLabel
                      style={{ margin: "0" }}
                      value="3"
                      control={<Radio />}
                      placeholder={t("Category_wise_Percentage")}
                    />
                    {t("Category_wise_Percentage")}
                  </Grid>
                </Grid>
              </RadioGroup>
              {storeManFormik.touched.commission_plan_type &&
                storeManFormik.errors.commission_plan_type &&
                !storeManFormik.values.commission_plan_type && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {t("Please choose plan.")}
                  </FormHelperText>
                )}
            </FormControl>
          </Grid>
        </Grid>

        {storeManFormik.values.commission_plan_type === "1" && (
          <>
            <Grid item xs={12} sm={12} md={6} align={isSmall || "center"}>
              <CustomBoxFullWidth>
                <FormControl style={{ minWidth: "300px" }}>
                  <FormLabel style={formLabelStyle()} required="true">
                    {t("Plan")}
                  </FormLabel>
                  {/*  <InputLabel
                      id="demo-simple-select-label"
                      sx={{ color: (theme) => theme.palette.neutral[1000] }}
                    >
                      {storeManFormik.values.subscription_id ? "" : ""}
                    </InputLabel> */}
                  <Select
                    displayEmpty
                    value={storeManFormik.values.subscription_id}
                    required="true"
                    onChange={(e) => handleSubscriptionPlans(e.target.value)}
                    touched={storeManFormik.touched.subscription_id}
                    errors={storeManFormik.errors.subscription_id}
                    fieldProps={storeManFormik.getFieldProps("zone_id")}
                  >
                    <MenuItem value="">
                      <em>{t("Select Plan")}</em>
                    </MenuItem>
                    {subscriptionPlanData?.length > 0 &&
                      subscriptionPlanData.map((item, index) => {
                        return (
                          <MenuItem
                            key={index}
                            value={item.value}
                            sx={{
                              "&:hover": {
                                backgroundColor: "primary.main",
                              },
                            }}
                          >
                            {t(item.label)}
                          </MenuItem>
                        );
                      })}
                    {subscriptionPlanData?.length === 0 && (
                      <MenuItem>No Records</MenuItem>
                    )}
                  </Select>
                  {storeManFormik.touched.subscription_id &&
                    !storeManFormik.values.subscription_id &&
                    storeManFormik.values.commission_plan_type === "1" && (
                      <FormHelperText
                        sx={{ color: (theme) => theme.palette.error.main }}
                      >
                        {t("Please choose plan.")}
                      </FormHelperText>
                    )}
                </FormControl>
              </CustomBoxFullWidth>
            </Grid>
            <Grid item xs={12} sm={12} md={6} align={isSmall || "center"}>
              <CustomBoxFullWidth>
                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
                  style={{ minWidth: "300px", maxWidth: "50%" }}
                >
                  <FormLabel style={formLabelStyle()} required="true">
                    {t("Category")}
                  </FormLabel>
                  {/* <InputLabel
                      id="grouped-select"
                      sx={{ color: (theme) => theme.palette.neutral[1000] }}
                    >
                      {storeManFormik.values.categories?.length > 0 ? "" : ""}{" "}
                    </InputLabel> */}
                  <Select
                    className="category"
                    displayEmpty
                    defaultValue=""
                    id="grouped-select"
                    multiple
                    value={categoryItems || []}
                    required="true"
                    onChange={handleSubCategory}
                    onMouseDown={checkSubcategory}
                    touched={storeManFormik.touched.categories}
                    errors={storeManFormik.errors.categories}
                    disabled={!storeManFormik.values.module_id}
                    renderValue={(selected) => {
                      let filteredCategoriess =
                        categories?.length > 0 &&
                        categories.map((obj) => {
                          return {
                            ...obj,
                            childes: obj.childes.filter((user) =>
                              selected.includes(user.id)
                            ),
                          };
                        });
                      let finalArray = [];
                      Object.values(filteredCategoriess).forEach((obj) => {
                        let arr = [];
                        obj.childes.forEach((invoc) =>
                          arr.push({ ...obj, nameOfCategory: invoc.name })
                        );
                        finalArray = finalArray.concat(arr);
                      });
                      return finalArray.map((x) => x.nameOfCategory).join(", ");
                    }}
                  >
                    {/* <MenuItem value=""><em>{t('Select Category')}</em></MenuItem> */}

                    {categories?.length > 0 &&
                      categories.map((category, index1) => {
                        let children = [];

                        children.push(
                          <ListSubheader>{category.name}</ListSubheader>
                        );
                        {
                          category.childes &&
                            category.childes.map((subCategory, index2) => {
                              children.push(
                                <MenuItem
                                  key={index2}
                                  value={subCategory.id}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "primary.main",
                                      color: "#fffff",
                                    },
                                  }}
                                >
                                  <Checkbox
                                    checked={
                                      categoryItems &&
                                      categoryItems.indexOf(subCategory.id) > -1
                                    }
                                  />
                                  <ListItemText primary={subCategory.name} />
                                </MenuItem>
                              );
                            });
                        }
                        return children;
                      })}
                    {(categories?.length <= 0 || !categories) && (
                      <MenuItem>No Records</MenuItem>
                    )}
                  </Select>
                  {storeManFormik.touched.categories &&
                    !storeManFormik.values.categories && (
                      <FormHelperText
                        sx={{ color: (theme) => theme.palette.error.main }}
                      >
                        {t("Please Choose an Category.")}
                      </FormHelperText>
                    )}
                  {!isSubcategory && (
                    <FormHelperText
                      sx={{ color: (theme) => theme.palette.error.main }}
                    >
                      {t("Please choose module")}
                    </FormHelperText>
                  )}
                </FormControl>
              </CustomBoxFullWidth>
            </Grid>
          </>
        )}

        {storeManFormik.values.commission_plan_type === "2" && (
          <>
            <Grid item xs={12} sm={12} md={6} align={isSmall || "center"}>
              <CustomBoxFullWidth>
                <FormControl style={{ minWidth: "300px" }}>
                  <FormLabel style={formLabelStyle()} required="true">
                    {t("Commission (%)")}
                  </FormLabel>
                  <CustomTextFieldWithFormik
                    autoComplete="off"
                    disabled="true"
                    value={storeManFormik.values.flat_percentage}
                    type="text"
                    placeholder={t("Flat Percentage")}
                    touched={storeManFormik.touched.flat_percentage}
                    errors={storeManFormik.errors.flat_percentage}
                    fieldProps={storeManFormik.getFieldProps("flat_percentage")}
                    /* onChangeHandler={emailHandler} */
                  />
                </FormControl>
              </CustomBoxFullWidth>
            </Grid>
            <Grid item xs={12} sm={12} md={6} align={isSmall || "center"}>
              <CustomBoxFullWidth>
                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
                  style={{ minWidth: "300px", maxWidth: "50%" }}
                >
                  <FormLabel style={formLabelStyle()} required="true">
                    {t("Category")}
                  </FormLabel>
                  {/*  <InputLabel
                      id="grouped-select"
                      sx={{ color: (theme) => theme.palette.neutral[1000] }}
                    >
                      {storeManFormik.values.categories?.length > 0 ? "" : ""}{" "}
                    </InputLabel> */}
                  <Select
                    className="category"
                    defaultValue=""
                    id="grouped-select"
                    onMouseDown={checkSubcategory}
                    multiple
                    value={categoryItems || []}
                    required="true"
                    onChange={handleSubCategory}
                    touched={storeManFormik.touched.categories}
                    errors={storeManFormik.errors.categories}
                    disabled={!storeManFormik.values.module_id}
                    renderValue={(selected) => {
                      let filteredCategoriess = categories.map((obj) => {
                        return {
                          ...obj,
                          childes: obj.childes.filter((user) =>
                            selected.includes(user.id)
                          ),
                        };
                      });
                      let finalArray = [];
                      Object.values(filteredCategoriess).forEach((obj) => {
                        let arr = [];
                        obj.childes.forEach((invoc) =>
                          arr.push({ ...obj, nameOfCategory: invoc.name })
                        );
                        finalArray = finalArray.concat(arr);
                      });
                      return finalArray.map((x) => x.nameOfCategory).join(", ");
                    }}
                  >
                    {categories?.length > 0 &&
                      categories.map((category, index1) => {
                        let children = [];

                        children.push(
                          <ListSubheader>{category.name}</ListSubheader>
                        );
                        {
                          category.childes &&
                            category.childes.map((subCategory, index2) => {
                              children.push(
                                <MenuItem
                                  key={index2}
                                  value={subCategory.id}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "primary.main",
                                      color: "#fffff",
                                    },
                                  }}
                                >
                                  <Checkbox
                                    checked={
                                      categoryItems &&
                                      categoryItems.indexOf(subCategory.id) > -1
                                    }
                                  />
                                  <ListItemText primary={subCategory.name} />
                                </MenuItem>
                              );
                            });
                          category.childes?.length < 0 && (
                            <MenuItem>-</MenuItem>
                          );
                        }
                        return children;
                      })}
                    {(categories?.length <= 0 || !categories) && (
                      <MenuItem>No Records</MenuItem>
                    )}
                  </Select>
                  {storeManFormik.touched.categories &&
                    !storeManFormik.values.categories && (
                      <FormHelperText
                        sx={{ color: (theme) => theme.palette.error.main }}
                      >
                        {t("Please Choose an Category.")}
                      </FormHelperText>
                    )}
                </FormControl>
              </CustomBoxFullWidth>
            </Grid>
          </>
        )}
        {storeManFormik.values.commission_plan_type === "3" && (
          <Grid item xs={12} sm={12} md={6} align={isSmall || "center"}>
            <CustomBoxFullWidth>
              <Grid item xs={12} sm={12} md={6} align={isSmall || "center"}>
                <CustomBoxFullWidth>
                  <FormControl
                    sx={{ m: 1, minWidth: 120 }}
                    style={{ minWidth: "300px", maxWidth: "50%" }}
                  >
                    <FormLabel style={formLabelStyle()} required="true">
                      {t("Category")}
                    </FormLabel>
                    {/* <InputLabel
                        id="grouped-select"
                        sx={{ color: (theme) => theme.palette.neutral[1000] }}
                      >
                        {storeManFormik.values.categories?.length > 0 ? "" : ""}{" "}
                      </InputLabel> */}
                    <Select
                      className="category"
                      defaultValue=""
                      id="grouped-select"
                      multiple
                      value={categoryItems || []}
                      required="true"
                      onMouseDown={checkSubcategory}
                      onChange={handleSubCategory}
                      touched={storeManFormik.touched.categories}
                      errors={storeManFormik.errors.categories}
                      disabled={!storeManFormik.values.module_id}
                      renderValue={(selected) => {
                        let filteredCategoriess = categories.map((obj) => {
                          return {
                            ...obj,
                            childes: obj.childes.filter((user) =>
                              selected.includes(user.id)
                            ),
                          };
                        });
                        let finalArray = [];
                        Object.values(filteredCategoriess).forEach((obj) => {
                          let arr = [];
                          obj.childes.forEach((invoc) =>
                            arr.push({
                              ...obj,
                              nameOfCategory:
                                invoc.name +
                                " (" +
                                invoc.commission_percentage +
                                "%)",
                            })
                          );
                          finalArray = finalArray.concat(arr);
                        });
                        return finalArray
                          .map((x) => x.nameOfCategory)
                          .join(", ");
                      }}
                    >
                      {categories?.length > 0 &&
                        categories.map((category, index1) => {
                          let children = [];

                          children.push(
                            <ListSubheader>{category.name}</ListSubheader>
                          );
                          {
                            category.childes &&
                              category.childes.map((subCategory, index2) => {
                                children.push(
                                  <MenuItem
                                    key={index2}
                                    value={subCategory.id}
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "primary.main",
                                        color: "#fffff",
                                        maxHeight: "100%",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      checked={
                                        categoryItems &&
                                        categoryItems.indexOf(subCategory.id) >
                                          -1
                                      }
                                    />
                                    <ListItemText
                                      primary={
                                        subCategory.name +
                                        "(" +
                                        subCategory.commission_percentage +
                                        "%)"
                                      }
                                    />
                                  </MenuItem>
                                );
                              });
                            category.childes?.length < 0 && (
                              <MenuItem></MenuItem>
                            );
                          }
                          return children;
                        })}
                      {(categories?.length <= 0 || !categories) && (
                        <MenuItem>No Records</MenuItem>
                      )}
                    </Select>
                    {storeManFormik.touched.categories &&
                      !storeManFormik.values.categories && (
                        <FormHelperText
                          sx={{ color: (theme) => theme.palette.error.main }}
                        >
                          {t("Please Choose an Category.")}
                        </FormHelperText>
                      )}
                  </FormControl>
                </CustomBoxFullWidth>
              </Grid>
            </CustomBoxFullWidth>
          </Grid>
        )}
      </CustomPaperBigCard>
      <br></br>

      <CustomPaperBigCard justifyContent="center" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountCircleIcon />
          <Typography variant="h5">{t("Login Info")}</Typography>
        </Stack>
        <Grid
          container
          rowSpacing={4}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ "margin-top": "1px" }}
        >
          <Grid item xs={4} sm={4} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Email")}
              </FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                value={storeManFormik.values.email}
                disabled={false}
                type="email"
                placeholder={t("Email")}
                touched={storeManFormik.touched.email}
                errors={storeManFormik.errors.email}
                fieldProps={storeManFormik.getFieldProps("email")}
                onChangeHandler={emailHandler}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Password")}
              </FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                required="true"
                type="password"
                disabled={false}
                placeholder={t("Password")}
                touched={storeManFormik.touched.password}
                errors={storeManFormik.errors.password}
                fieldProps={storeManFormik.getFieldProps("password")}
                onChangeHandler={passwordHandler}
                value={storeManFormik.values.password}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <FormControl fullWidth>
              <FormLabel style={formLabelStyle()} required="true">
                {t("Confirm Password")}
              </FormLabel>
              <CustomTextFieldWithFormik
                autoComplete="off"
                required="true"
                type="password"
                placeholder={t("Confirm Password")}
                value={storeManFormik.values.confirm_password}
                inputplaceholder={t("Confirm Password")}
                touched={storeManFormik.touched.confirm_password}
                errors={storeManFormik.errors.confirm_password}
                onChangeHandler={confirmPasswordHandler}
                fieldProps={storeManFormik.getFieldProps("confirm_password")}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <Captcha
              placeholder={t("Enter captcha")} /* optional */
              length={6} /* default */
              char={(1, 2, 3, 4, 5, 6, 7, 8, 9)}
              onChange={handleRecaptchaChange}
              touched={storeManFormik.touched.recaptcha}
              errors={storeManFormik.errors.recaptcha}
              fieldProps={storeManFormik.getFieldProps("recaptcha")}
            />
            {!storeManFormik.values.recaptcha && isSubmittedForm && (
              <>
                <FormHelperText
                  sx={{ color: (theme) => theme.palette.error.main }}
                >
                  {t("Invalid recaptcha")}
                </FormHelperText>
              </>
            )}
          </Grid>
        </Grid>
      </CustomPaperBigCard>
    </NoSsr>
  );
};

export default StoreApplyForm;
