import React, { useEffect, useReducer, useState } from "react";
import { Box, Stack } from "@mui/system";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CustomModal from "../../modal";
import CloseIcon from "@mui/icons-material/Close";
import {
  AddressTypeStack,
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import "simplebar-react/dist/simplebar.min.css";

import { ACTIONS, initialState, reducer } from "../states";
import { useGeolocated } from "react-geolocated";
import useGetAutocompletePlace from "../../../api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetGeoCode from "../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../api-manage/hooks/react-query/google-api/useGetZone";
import useGetPlaceDetails from "../../../api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import GoogleMapComponent from "../../Map/GoogleMapComponent";
import AddressForm from "./AddressForm";
import CustomImageContainer from "../../CustomImageContainer";
import home from "../../checkout/assets/image 1256.png";
import office from "../assets/office.png";
import plusIcon from "../assets/plus.png";
import { useDispatch, useSelector } from "react-redux";
import { setOpenAddressModal } from "../../../redux/slices/addAddress";
import {
  handleAgreeLocation,
  handleCloseLocation,
} from "../HelperFunctions";
import { styled } from "@mui/material/styles";
import CustomMapSearch from "../../Map/CustomMapSearch";

export const AddAddressSearchBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  zIndex: "999",
  width: "85%",
  top: "10%",
  marginLeft: "20px",
  [theme.breakpoints.down("md")]: {
    marginLeft: "13px",
  },
}));

const AddNewAddress = (props) => {
  const {
    configData,
    refetch,
    t,
    openAddressModal,
    editAddress,
    setEditAddress,
    setAddress,
    address,
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const [editAddressLocation, setEditAddressLocation] = useState({
    lat: address?.latitude,
    lng: address?.longitude,
  });
  const token = localStorage.getItem("token");
  const reduxDispatch = useDispatch();
  const [addressType, setAddressType] = useState(
    guestUserInfo ? guestUserInfo?.address_type : ""
  );
  const personName = `${profileInfo?.f_name} ${profileInfo?.l_name}`;
  const [predictions, setPredictions] = useState([]);
  const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(true);
  const [placeId, setPlaceId] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState({
    lat: address?.latitude,
    lng: address?.longitude,
  });
  const currentLatLng = JSON.parse(localStorage.getItem("currentLatLng"));
  const [placeDescription, setPlaceDescription] = useState(undefined);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isDisablePickButton, setDisablePickButton] = useState(false);
  const [is_primary, setPrimary] = useState(false);
  /* useEffect calls for getting data */
  /* ****getting current location** */
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });
  /*  const editLocation = {
    lat: editAddress?.latitude,
    lng: editAddress?.longitude,
  }; */

  const { data: places, isLoading } = useGetAutocompletePlace(
    searchKey,
    enabled
  );
  useEffect(() => {
    if (places) {
      /* dispatch({ type: ACTIONS.setPredictions, payload: places?.predictions }); */
      setPredictions(places?.predictions);
    }
  }, [places]);

  const zoneIdEnabled = locationEnabled;
  const { data: zoneData } = useGetZoneId(currentLatLng, zoneIdEnabled);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (zoneData) {
        /* dispatch(setZoneData(zoneData?.data?.zone_data)); */
        localStorage.setItem("zoneid", zoneData?.zone_id);
      }
    }
  }, [zoneData]);
  const { isLoading: isLoading2, data: placeDetails } = useGetPlaceDetails(
    placeId,
    placeDetailsEnabled
  );

  useEffect(() => {
    if (placeDetails) {
      /* dispatch({
        type: ACTIONS.setLocation,
        payload: placeDetails?.result?.geometry?.location,
      }); */
      setLocation(placeDetails?.result?.geometry?.location);
      setLocationEnabled(true);
    } else {
      setLocation({ lat: address?.latitude, lng: address?.longitude });
    }
  }, [placeDetails, address]);
  useEffect(() => {
    const editLatLng = { lat: address?.latitude, lng: address?.longitude };
    dispatch({
      type: ACTIONS.setLocation,
      payload: editLatLng,
    });
  }, []);

  const { data: geoCodeResults, isFetching: isFetchingGeoCode } = useGetGeoCode(
    location,
    state.geoLocationEnable
  );

  useEffect(() => {
    setEditAddressLocation(state?.location);
  }, [state?.location]);

  /* useEffect(() => {
    dispatch({
      type: ACTIONS.setLocation,
      payload: editLocation,
    });
  }, [editAddress]);
  const { data: places, isLoading } = useGetAutocompletePlace(
    state.searchKey,
    state.enabled
  ); */

  useEffect(() => {
    if (geoCodeResults?.results) {
      dispatch({
        type: ACTIONS.setCurrentLocation,
        payload: geoCodeResults?.results[0]?.formatted_address,
      });
    }
  }, [geoCodeResults, state.location]);

  /* //********************Pick Location 
  const { isLoading: isLoading2, data: placeDetails } = useGetPlaceDetails(
    state.placeId,
    state.placeDetailsEnabled
  ); */

  /* const orangeColor = theme.palette.primary.main; */

  useEffect(() => {
    if (state.placeDescription) {
      dispatch({
        type: ACTIONS.setCurrentLocation,
        payload: state.placeDescription,
      });
    }
  }, [state.placeDescription]);
  const handleClick = (name) => {
    setAddressType(name);
    if (editAddress) {
      setEditAddress({ ...editAddress, address_type: name });
    }
  };
  const closePopover = () => {
    reduxDispatch(setOpenAddressModal(false));
  };
  const handleChangeS = (event, value, dispatch) => {
    if (value) {
      setPlaceId(value?.place_id);
    }
    setPlaceDetailsEnabled(true);
  };
  const handleChangeForSearchs = (event, dispatch) => {
    if (event.target.value) {
      setSearchKey(event.target.value);
      setEnabled(true);
      setPlaceDetailsEnabled(true);
    }
  };
  const primaryHandleChange = (e) => {
    setPrimary(e.target.checked);
    if (editAddress) {
      setEditAddress({
        ...editAddress,
        is_primary: e.target.checked === true ? 1 : 0,
      });
    }
  };
  return (
    <Box>
      {openAddressModal && (
        <CustomModal
          openModal={openAddressModal}
          handleClose={() => reduxDispatch(setOpenAddressModal(false))}
        >
          <Paper
            sx={{
              position: "relative",
              width: { xs: "300px", sm: "450px", md: "550px", lg: "730px" },
              p: "1.4rem",
            }}
          >
            <IconButton
              onClick={() => reduxDispatch(setOpenAddressModal(false))}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <CloseIcon sx={{ fontSize: "16px" }} />
            </IconButton>

            <CustomStackFullWidth
              alignItems="center"
              justifyContent="center"
              sx={{ marginBottom: "1rem" }}
            >
              {/*<SimpleBar style={{ maxHeight: "60vh" }}></SimpleBar>*/}
            </CustomStackFullWidth>
            <AddAddressSearchBox>
              <CustomMapSearch
                /*  showCurrentLocation={state.showCurrentLocation} */
                predictions={predictions}
                handleChange={(event, value) =>
                  handleChangeS(event, value, dispatch)
                }
                HandleChangeForSearch={(event) =>
                  handleChangeForSearchs(event, dispatch)
                }
                handleAgreeLocation={() =>
                  handleAgreeLocation(coords, dispatch)
                }
                currentLocation={state.currentLocation}
                handleCloseLocation={() => handleCloseLocation(dispatch)}
                /* frommap="true"
                isLoading={isFetchingGeoCode} */
              />
            </AddAddressSearchBox>
            <GoogleMapComponent
              height="236px"
              /*  key={state.rerenderMap}
              setLocation={(values) => {
                dispatch({
                  type: ACTIONS.setLocation,
                  payload: values,
                });
              }} */
              setLocation={setLocation}
              location={location}
              /*  setCurrentLocation={setCurrentLocation}
              locationLoading={locationLoading}
              location={editAddress ? editAddressLocation : state.location}
              setPlaceDetailsEnabled={(value) =>
                dispatch({
                  type: ACTIONS.setPlaceDetailsEnabled,
                  payload: value,
                })
              } */
              setPlaceDetailsEnabled={setPlaceDetailsEnabled}
              placeDetailsEnabled={placeDetailsEnabled}
              locationEnabled={locationEnabled}
              setPlaceDescription={setPlaceDescription}
              setLocationEnabled={setLocationEnabled}
              setDisablePickButton={setDisablePickButton}
            />

            <CustomStackFullWidth pt="20px">
              <Typography>{t("Label As")}</Typography>
              <Stack direction="row" spacing={2.5} pt="10px">
                <AddressTypeStack
                  value="home"
                  addressType={
                    guestUserInfo
                      ? addressType
                      : editAddress?.address_type || addressType
                  }
                  onClick={() => handleClick("home")}
                >
                  <CustomImageContainer
                    src={home.src}
                    width="24px"
                    height="24px"
                  />
                </AddressTypeStack>
                <AddressTypeStack
                  value="office"
                  addressType={
                    editAddress?.address_type
                      ? editAddress?.address_type
                      : addressType
                  }
                  onClick={() => handleClick("office")}
                >
                  <CustomImageContainer
                    src={office.src}
                    width="24px"
                    height="24px"
                  />
                </AddressTypeStack>
                <AddressTypeStack
                  value="other"
                  addressType={
                    editAddress?.address_type
                      ? editAddress?.address_type
                      : addressType
                  }
                  onClick={() => handleClick("other")}
                >
                  <CustomImageContainer
                    src={plusIcon.src}
                    width="24px"
                    height="24px"
                  />
                </AddressTypeStack>
                {token && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          editAddress ? editAddress?.is_primary : is_primary
                        }
                        onChange={primaryHandleChange}
                      />
                    }
                    label={"Primary"}
                  />
                )}
              </Stack>
            </CustomStackFullWidth>
            <CustomStackFullWidth mt="1.3rem">
              <AddressForm
                atModal="true"
                setAddressType={setAddressType}
                addressType={
                  editAddress?.address_type
                    ? editAddress?.address_type
                    : addressType
                }
                configData={configData}
                setEditAddress={setEditAddress}
                deliveryAddress={geoCodeResults?.results[0]}
                personName={
                  editAddress ? editAddress?.contact_person_name : personName
                }
                phone={
                  editAddress
                    ? editAddress?.contact_person_number
                    : profileInfo?.phone
                }
                lat={editAddress ? editAddress?.lat : state.location?.lat}
                lng={editAddress ? editAddress?.lng : state.location?.lng}
                popoverClose={closePopover}
                refetch={refetch}
                isRefetcing={isFetchingGeoCode}
                editAddress={editAddress}
                setAddress={setAddress}
                pincode={editAddress ? editAddress.pincode : ""}
                primaryKey={editAddress ? editAddress?.is_primary : is_primary}
              />
            </CustomStackFullWidth>
          </Paper>
        </CustomModal>
      )}
    </Box>
  );
};

AddNewAddress.propTypes = {};

export default AddNewAddress;
