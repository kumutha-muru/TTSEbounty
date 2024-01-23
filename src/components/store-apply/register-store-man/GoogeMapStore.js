/*global google*/
import React, { useEffect, useState } from "react";
import { GoogleMap, StandaloneSearchBox, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import CustomAlert from "../../../../src/components/alert/CustomAlert";
import { get_zone_coordinates_api } from "../../../api-manage/ApiRoutes";
import MainApi from "../../../api-manage/MainApi";
const libraries = ['places'];

const GoogeMapStore = (props) => {
  const [state, setState] = useState({
    currentLocation: { lat: 0, lng: 0 },
    markers: [],
    bounds: null
  });

  let markerArray = [];
  const [searchBox, setSearchBox] = useState(null);
  const [myMap, setMymap] = useState(null);
  const [polygonValue, setPolygonValue] = useState(null);

  /* let [isInfoWindow, setInfoWindow] = useState(null); */
  /* const lib = ['places'];
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY; */
  let zonePolygon = null;
  let myLatlng = {
    lat: 9.951990,
    lng: 78.179451
  };
  let infoWindow;
  if (window.google && window.google.maps) {
    setTimeout(()=>{
      infoWindow = new window.google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatlng,
      });
    },2000);
  }
    
  const onMapLoad = map => {
    infoWindow = new window.google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: myLatlng,
    });
    /* Create the initial InfoWindow. */
    infoWindow.open(map);
    /* get current location block */
    infoWindow = new window.google.maps.InfoWindow();
    setMymap(map);
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        setState({ currentLocation: pos });
        myLatlng = {
          lat: lat,
          lng: lng
      };
      infoWindow.setPosition(myLatlng);
      infoWindow.setContent("Location found.");
      infoWindow.open(map);
      map.setCenter(myLatlng);
      }
    );
    window.google.maps.event.addListener(map, "bounds_changed", () => {
      setState({ bounds: map.getBounds() });
    });
   
  };
  useEffect(() => {
    if(props.zoneValue){
      zonePolygon = polygonValue;
    }else{
      zonePolygon = null;
    }
    handleMapToZone();
  }, [props.zoneValue]);


  const onSBLoad = ref => {
    setSearchBox(ref);
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    libraries: libraries
  });
  const onPlacesChanged = () => {
    if (searchBox?.getPlaces() !== null) {
      markerArray = [];
      let place = searchBox.getPlaces();

      if (place != undefined) {
        if (place.length == 0) {
          return;
        }
        place.forEach((pla) => {
          if (!pla.geometry || !pla.geometry.location) {
            <CustomAlert
              type="info"
              text={t("Returned place contains no geometry.")}
            />
            return;
          }
        })
      }

      for (let i = 0; i < place.length; i++) {
        let placee = place[i].geometry.location;
        markerArray.push(placee);
      }
      setState({ markers: markerArray });
    }

  };

  const handleMapToZone = async () => {
    
    if (props.zoneValue) {
      let zoneNavigate_API = get_zone_coordinates_api + "/" + props.zoneValue;
      const { data } = await MainApi.get(zoneNavigate_API);
      console.log(data);
      if (zonePolygon) {
        zonePolygon.setMap(null);
        zonePolygon = null;
      }
      zonePolygon = new window.google.maps.Polygon({
        paths: data.coordinates,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'white',
        fillOpacity: 0,
      });
      zonePolygon.setMap(myMap);
      let bounds = new window.google.maps.LatLngBounds();
      zonePolygon.getPaths().forEach(function (path) {
        path.forEach(function (latlng) {
          bounds.extend(latlng);
          myMap.fitBounds(bounds);
        });
      });
      myMap.setCenter(data.center);
      setPolygonValue(zonePolygon);
      google.maps.event.addListener(zonePolygon, 'click', function (mapsMouseEvent) {
        infoWindow.close();
        /* Create a new InfoWindow. */
        infoWindow = new google.maps.InfoWindow({
          position: mapsMouseEvent.latLng,
          content: JSON.stringify(mapsMouseEvent.latLng.toJSON(),
            null, 2),
        });
        const coordinates = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null,
          2);
        const coordinates_a = JSON.parse(coordinates);
        props.parentCallback(coordinates_a);
        infoWindow.open(myMap);
      });
    }
  }

  return (
    isLoaded && (
      <div style={{ position: "relative" }}>
        <div id="searchbox" style={{ position: "absolute" }}>
          <StandaloneSearchBox
            onLoad={onSBLoad}
            onPlacesChanged={onPlacesChanged}
            bounds={state.bounds}
          >
            <input
              type="text"
              placeholder="Search here"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                left: "50%",
                marginTop: "23px",
              }}
            />
          </StandaloneSearchBox>
        </div>
        <br />
        <div>
          <GoogleMap
            center={state.currentLocation}
            zoom={8}
            ref={myMap}
            onLoad={(map) => onMapLoad(map)}
            mapContainerStyle={{
              height: "400px",
              width: "100%",
              position: "relative",
            }}
          >
            {state.markers &&
              state.markers.map((mark, index) => (
                <MarkerF key={index} position={mark} />
              ))}
          </GoogleMap>
        </div>
      </div>
    )
  );
}

export default GoogeMapStore;
