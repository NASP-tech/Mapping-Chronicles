/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/*
    Este componente se encarga de mostrar la parada de bus más cercana al usuario.
*/
import React, { useState, useEffect} from "react";
import { Source, Layer } from "react-map-gl";
import { BASE_URL } from "../services";

export default function NearestBustStop ({coords, ...props }){

    const [ nearestBusStop, setNearestBusStop ] = useState([])

    useEffect(()=> {

        fetch(`${BASE_URL}/layers/getNearestBusStop/?latitude=${coords.lat}&longitude=${coords.lng}`)
        .then(res => res.json())
        .then(data => {
            setNearestBusStop(data)
        }
        )
        .catch(err => console.log(err))

    },[coords])


    return(
        nearestBusStop[0] &&
        <Source id="nearest-bus-stop" type="geojson" data={nearestBusStop[0]}>
            <Layer

                id="nearest-bus-stop"
                type="circle"
                source="nearest-bus-stop"
                paint={{
                    "circle-radius" : 9,
                    "circle-color" : "green"

                }}
                {...props}
                />
        </Source>
    )
}