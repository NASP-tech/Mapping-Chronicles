import { useCallback, useEffect, useState } from "react";

import ReactMapGL, { Marker, Popup } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Room, Star } from "@material-ui/icons"
import "./app.css"
import axios from "axios";
import { format } from "timeago.js";
import Swal from 'sweetalert';
import Register from "./components/Register";
import Login from "./components/Login";
import EntradasUCALayer from "./components/layers/EntradasUCALayer";
import BufferEntradasUCALayer from "./components/layers/BufferEntradasUCA";
import RutasPrimarias from "./components/layers/RutasPrimarias";
import ParadasPrimarias from "./components/layers/ParadasPrimarias";
import LocationComponent from "./components/LocationComponent";
import DynamicBuffer from "./components/DynamicBuffer";
import MyBusStops from "./components/MyBusStops";
import Map from "./components/Map";
import DynamicPopUp from "./components/DynamicPopUp";
const REACT_APP_MAPBOX_TOKEN = 'pk.eyJ1IjoibmF0c29scDc3IiwiYSI6ImNsaHF5ejBwYTBkajgzZG1yem02cXI2NW8ifQ.H2s0rN7AbaF2N2kRXWEkxA';

function App() {
  const myStorage = window.localStorage;

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [username, setUsername] = useState(myStorage.getItem("user"));
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: -89.23624,
    longitude: 13.68023,
    zoom: 14
  });

  useEffect(() => {
    const getPins = async () => {
      const url = 'http://localhost:5000/api/pins'
      try {
        const res = await axios.get(url);
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
    setViewport({ ...viewport, latitude: lat, longitude: lng });
  }

  const handleNewPinClick = (e) => {
    const { lngLat } = e;
    const lat = lngLat.lat;
    const lng = lngLat.lng;
    console.log(e)
    setLat(lat);
    setLong(lng);

    setNewPlace({
      lat,
      lng,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:5000/api/pins';

    const body = {
      "username": username,
      "title": title,
      "desc": desc,
      "rating": rating,
      "lat": lat,
      "long": long
    };

    try {
      const { data } = await axios.post(url, body).then(response => {
        Swal("Success", "Pin Created!", "success")
      });;
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setUsername(null);
  }


  // <>

  const [ coords, setCoords ] = useState({ lat: 0, lng: 0 });
  const [ showPopup, setTogglePopup ] = useState(false)
  const [ coordsLayerSelected, setCoordsLayerSelected ] = useState({lat: 0, lng: 0})
  const [ dataFeature, setDataFeature ] = useState({properties:{id:0, nombre:""}})
  


  const handleMapOnClick =  (e) => {
    if(!e) return
    //console.log(e.lngLat)
    setCoordsLayerSelected({
      lat : e.lngLat.lat,
      lng : e.lngLat.lng
    }
      )
    const feature = e.features[0]
    console.log(feature)
    setDataFeature(feature)
    setTogglePopup(true)
    console.log('click' + showPopup + coordsLayerSelected.lat)
  }

  return (
    <div className="App">

   <ReactMapGL
        initialViewState={{
          longitude: -89.23624,
          latitude: 13.68023,
          zoom: 14
        }}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
        onDblClick={handleNewPinClick}
        interactiveLayerIds={['rutasPrimarias', 'paradasPrimarias', 'entradasUCA', 'bufferEntradasUCA']}
        onClick={(e) => {
          // console.log( e.features[0] ? e.features[0] : "undefined")
          setTogglePopup(false)
          if(!e.features[0]) {
            setDataFeature({properties:{id:0, nombre:""}})
            return
          }
          handleMapOnClick(e.features[0] ? e : null)

        } }
        on
        transitionDuration="200"
      >
        <LocationComponent
            offsetLeft={visualViewport.zoom * 5}
            offsetTop={-visualViewport.zoom * 10} 
            setCoords={setCoords} />


        <RutasPrimarias /> 
        <EntradasUCALayer /> 
        <ParadasPrimarias />
        <BufferEntradasUCALayer /> 
        

        {
          showPopup && (
            <DynamicPopUp
              feature={dataFeature}
              latitude={coordsLayerSelected.lat}
              longitude={coordsLayerSelected.lng}
              onClose={() => setTogglePopup(false)}
            />  
          )
        }
        {coords.lat !== 0 && coords.lng !== 0 && (
          <MyBusStops coords={coords} idPointSelected={showPopup ? dataFeature.properties.id : null} />) }  

        {coords.lat !== 0 && coords.lng !== 0 && (
          <DynamicBuffer coords={coords} />) }  
        {username ?
          (
            <button
              className="button logout"
              onClick={handleLogout}
            >Log Out</button>
          ) : (
            <div className="buttons">
              <button
                className="button login"
                onClick={() => setShowLogin(true)}
              >Login</button>
              <button
                className="button register"
                onClick={() => setShowRegister(true)}
              >Register</button>
            </div>
          )}
        {
          showRegister && <Register setShowRegister={setShowRegister} />
        }
        {
          showLogin && <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setUsername={setUsername}
          />
        }

        {pins.map((p) => (
          <>
            <Marker
              key={p.title}
              latitude={p.lat}
              longitude={p.long}
              anchor="bottom"
              offsetLeft={visualViewport.zoom * 5}
              offsetTop={-visualViewport.zoom * 10}
            >
              <Room
                style={{
                  fontSize: visualViewport.zoom * 10,
                  color: p.username === username ? "blue" : "red",
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
                key={p.lat + p.lng}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="starts">
                    {Array(p.rating).fill(<Star className="star" />)}
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
              <form onSubmit={(e) => handleClick(e)}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)} />
                <label>Rating</label>
                <select
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <input
                  className="submitButton"
                  type="submit"
                  value="Add pin"
                />
              </form>
            </div>
          </Popup>
        )}
      </ReactMapGL>


      {/* <Map coords={coords}/> */}
    
    </div >
  );
}

export default App;