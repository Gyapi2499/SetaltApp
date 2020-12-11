import React, {useState} from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import MapIcon from '@material-ui/icons/Map';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import appStyles from './AppStyles'

import {
  GoogleMap,
  Marker,
  Circle,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import {CircularProgress, Container, Grid} from "@material-ui/core";

const mapContainerStyle = {
  height: "80vh",
  width: "100%",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 47.4983815,
  lng: 19.0404707
}

export default function App() {

  const classes = appStyles();
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  function goToMap(){
    setIsClicked(true);
  }

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => center.lat, lng: () => center.lng },
      radius: 400 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const {lat, lng} = await getLatLng(results[0]);
      setLatitude(lat);
      setLongitude(lng);
    } catch (error) {
      console.log("Hiba: ", error);
    }
  };


  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <img src="dog.svg" alt="Kutya ikon" width="2%" height="2%"/>
            <Typography variant="h6" className={classes.title}>
              SétáltAPP
            </Typography>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" href="https://gyapi2499.github.io/SetaltApp/" >
              <ReplayIcon/>
            </IconButton>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => {
              navigator.geolocation.getCurrentPosition(
                  (position) => {
                      setLatitude(position.coords.latitude)
                      setLongitude(position.coords.longitude)
                  },
                  () => null
              );
              setIsClicked(true);
            }}>
              <MyLocationIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      {!isClicked &&
      <Container maxWidth="sm" className={classes.search}>
        <Typography variant="h5" gutterBottom>
          Üdvözöllek a SétáltAPP oldalán!
        </Typography>
        <Typography variant="body1" gutterBottom>
          A célunk az alkalmazással, hogy ebben a vírussal teli időszakban, le ne csukjanak, ha este levinnéd sétálni a kutyusod.
        </Typography>
        <Typography variant="body1" className={classes.udvozloAlatt}>
          Ha egy bizonyos címre szeretnéd megnézni az 500m-es körzetet, akkor azt lejjebb megteheted. Ha a tartózkodási helyed alapján szeretnéd megnézni, akkor pedig kattints a fejléc jobb oldali gombjára.
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6} className={classes.kozepre}>
        Kérlek add meg a címed:
          </Grid>
          <Grid item xs={6} className={classes.kozepre}>
            Kattints a térkép gombra a megjelenítéshez:
          </Grid>
          <Grid item xs={6} style={{alignSelf:"center"}}>
            <Combobox onSelect={handleSelect}>
              <ComboboxInput
                  value={value}
                  onChange={handleInput}
                  disabled={!ready}
                  className={classes.searchForm}
              />
              <ComboboxPopover>
                <ComboboxList>
                  {status === "OK" &&
                  data.map(({ place_id, description }) => (
                      <ComboboxOption key={place_id} value={description} />
                  ))}
                </ComboboxList>
              </ComboboxPopover>
            </Combobox>
          </Grid>
          <Grid item xs={6} className={classes.kozepre}>
        <IconButton aria-label="to-map" className={classes.margin} onClick={e => {goToMap(e)}} disabled={!longitude} >
          <MapIcon/>
        </IconButton>
          </Grid>
        </Grid>
        <Typography variant="body2" className={classes.inputAlatt}>
          Készítette: Káposzta Gergő és Pálinkás István
        </Typography>
        <Typography variant="body2" className={classes.kozepre}>
          Készült az ELTE Térképtudományi és Geoinformatikai Tanszékén
        </Typography>
        <Typography variant="body2" gutterBottom className={classes.kozepre}>
          Budapest, 2020
        </Typography>
      </Container>
      }
      {isClicked && latitude===0 &&
        <div className={classes.loading}>
          <CircularProgress size={80}/>
        </div>
      }
      {isClicked && latitude!==0 &&
      <Container maxWidth="xl" className={classes.terkepFolott}>
        <GoogleMap
            id="map"
            mapContainerStyle={mapContainerStyle}
            zoom={16}
            center={{
              lat: latitude,
              lng:longitude
            }}
            options={options}
            onLoad={onMapLoad}
        >
          <Marker
              position={{
                lat: latitude,
                lng: longitude
              }}
              icon={{
                url:'/SetaltApp/dog.svg',
                scaledSize: new window.google.maps.Size(30,30)
              }}
          />
          <Circle center={{lat: latitude, lng: longitude}} radius={500}/>
        </GoogleMap>
      </Container>
      }
    </div>
  );
}