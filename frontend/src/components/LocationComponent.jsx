/*
    Se utiliza el hook useState para almacenar los datos de la capa
    Se utiliza el hook useEffect para realizar la petición de los datos al servidor
    Se utiliza el componente Source para definir la fuente de los datos
    Se utiliza el componente Layer para definir la capa de los datos
    Se utiliza el componente BASE_URL para definir la ruta base de la petición
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
                    console.log(position.coords)
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