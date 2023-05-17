import { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {Room} from "@material-ui/icons"

const REACT_APP_MAPBOX_TOKEN = 'pk.eyJ1IjoibmF0c29scDc3IiwiYSI6ImNsaHF5ejBwYTBkajgzZG1yem02cXI2NW8ifQ.H2s0rN7AbaF2N2kRXWEkxA';

function App() {

  return (
    <div className="App">
      hello
      <ReactMapGL
        initialViewState={{
          longitude: -89.23624,
          latitude: 13.68023,
          zoom: 14
        }}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
      >

        <Marker longitude={-89.23624} latitude={13.68023} anchor="bottom" >
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Logo_UCA_2015.jpg" width={50} height={70}/> */}
          <Room style={{fontSize:visualViewport.zoom *10}}/>
        </Marker>

      </ReactMapGL>
    </div>
  );
}

export default App;
