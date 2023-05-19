import { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Room, Star } from "@material-ui/icons"
import "./app.css"
import axios from "axios";
import { format } from "timeago.js";

const REACT_APP_MAPBOX_TOKEN = 'pk.eyJ1IjoibmF0c29scDc3IiwiYSI6ImNsaHF5ejBwYTBkajgzZG1yem02cXI2NW8ifQ.H2s0rN7AbaF2N2kRXWEkxA';

function App() {
  const currentUser = "Nat Sol"
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: -89.23624,
    longitude: 13.68023,
    zoom: 14
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, [])

  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);
    // console.log(id);
    setViewport({...viewport, latitude: lat, longitude: lng});
  }

  const handleNewPinClick = (e) => {
    const { lngLat } = e;
    const lat = lngLat.lat;
    const lng = lngLat.lng;
    setNewPlace({
      lat,
      lng,
    });
  };

  return (
    <div className="App">
      Chronicles Mapping App
      <ReactMapGL
        initialViewState={{
          longitude: -89.23624,
          latitude: 13.68023,
          zoom: 14
        }}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
        onDblClick={handleNewPinClick}
        transitionDuration="200"
      >

        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              anchor="bottom" >
              {/* <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Logo_UCA_2015.jpg" width={50} height={70}/> */}
              <Room
                style={{
                  fontSize: visualViewport.zoom * 10,
                  color: p.username === currentUser ? "blue" : "red",
                  cursor: "pointer"
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.lng)}
              />
            </Marker>

            {p._id === currentPlaceId && (
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="starts">
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                  </div>
                  <label>Information</label>
                  <span className="username">Created by <b>{p.username}</b></span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup >
            )}

          </>
        ))}
        {newPlace && (

          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.lng}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form>
              <label>Title</label>
              <input placeholder="Enter a title" />
              <label>Review</label>
              <textarea placeholder="Say us something about this place." />
              <label>Rating</label>
              <select>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">Add Pin</button>
              </form>
            </div>
          </Popup>
        )}

      </ReactMapGL>
    </div >
  );
}

export default App;
