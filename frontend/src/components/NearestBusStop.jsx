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