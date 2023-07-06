/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/*
    Este componente se encarga de obtener la ubicación del usuario y mostrarla en el mapa con un marcador.
*/
import React, { useEffect, useState} from "react";
import { Marker } from "react-map-gl";
import { Room, Star } from "@material-ui/icons"
export default function LocationComponent({viewport, setCoords, style, ...props}) {

    const [ location, setLocation ] = useState(null)

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    //console.log(position.coords)
                    setLocation({ latitude, longitude });
                    setCoords({lat: latitude, lng: longitude})
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    useEffect(() => {
        getLocation()
    }, [])

    // setInterval(() => {
    //     getLocation()
    //     }, 10000
    //     )
    return(
        <>
        <Marker
            key={'marker'}
            latitude={location ? location.latitude : 0}
            longitude={location ? location.longitude : 0}
            anchor="bottom"
            {...props}
            >
            <Room
                style={style}
              />
        </Marker>

                </>
    )
        }