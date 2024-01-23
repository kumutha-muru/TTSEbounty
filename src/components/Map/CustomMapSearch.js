import React from "react";
import { SearchLocationTextField } from "../landing-page/hero-section/HeroSection.style";
import { Autocomplete, IconButton } from "@mui/material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";
import SearchIcon from "@mui/icons-material/Search";
import { FacebookCircularProgress } from "../loading-spinners/FacebookLoading";
const CustomMapSearch = ({
  showCurrentLocation,
  predictions,
  handleChange,
  HandleChangeForSearch,
  handleAgreeLocation,
  currentLocation,
  handleCloseLocation,
  frommap,
  placesIsLoading,
  currentLocationValue,
  fromparcel,
  isLoading,
  noleftborder,
  testLocation,
  borderRadius,
  toReceiver,
}) => {
  const border_Radius = borderRadius || "0px";
  const from_parcel = fromparcel === "true" ? "-61px" : "-31px";
  const display_from_parcel = fromparcel !== "true" && "none";
  const icon_button_a = (
    <IconButton
      sx={{
        mr: "-61px",
        padding: "5px",
      }}
    >
      <CloseIcon
        style={{
          cursor: "pointer",
          height: "20px",
        }}
        onClick={() => handleCloseLocation()}
      />
    </IconButton>
  );
  const icon_button_b = (
    <>
      {toReceiver === "true" ? null : (
        <IconButton
          sx={{
            mr: from_parcel,
            padding: "5px",
            display: display_from_parcel,
          }}
          onClick={() => handleAgreeLocation()}
        >
          <GpsFixedIcon color="primary" />
        </IconButton>
      )}
    </>
  );
  const current_loc = currentLocationValue?.description
    ? icon_button_a
    : icon_button_b;
  return (
    <>
      {!showCurrentLocation ? (
        <Autocomplete
          fullWidth
          options={predictions}
          getOptionLabel={(option) => option.description}
          onChange={(event, value) => handleChange(event, value)}
          value={currentLocationValue}
          clearOnBlur={false}
          loading={frommap === "true" ? placesIsLoading : null}
          loadingText={
            frommap === "true" ? t("Search suggestions are loading...") : ""
          }
          renderInput={(params) => (
            <SearchLocationTextField
              noleftborder={noleftborder}
              frommap={frommap}
              fromparcel={fromparcel}
              id="outlined-basic"
              {...params}
              placeholder={t("Search location here...")}
              onChange={(event) => HandleChangeForSearch(event)}
              InputProps={{
                ...params.InputProps,
                endAdornment:
                  frommap === "true" ? (
                    <IconButton
                      sx={{
                        mr: "-31px",

                        borderRadius: border_Radius,
                        padding: "7px 10px",
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  ) : (
                    current_loc
                  ),
              }}
              required={true}
            />
          )}
        />
      ) : (
        <SearchLocationTextField
          margin_top="true"
          size="small"
          variant="outlined"
          id="outlined-basic"
          placeholder={t("Search location here...")}
          value={testLocation || currentLocation}
          onChange={(event) => HandleChangeForSearch(event)}
          required={true}
          frommap={frommap}
          fromparcel={fromparcel}
          InputProps={{
            endAdornment: !showCurrentLocation ? (
              <IconButton onClick={() => handleAgreeLocation()}>
                <GpsFixedIcon color="primary" />
              </IconButton>
            ) : (
              <>
                {isLoading ? (
                  <FacebookCircularProgress />
                ) : (
                  <IconButton sx={{ padding: "5px" }}>
                    <CloseIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCloseLocation()}
                    />
                  </IconButton>
                )}
              </>
            ),
          }}
        />
      )}
    </>
  );
};

export default CustomMapSearch;
