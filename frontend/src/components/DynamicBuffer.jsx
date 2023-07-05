/* 
    Esta función se encarga de crear un buffer dinámico en el mapa, el cual se actualiza cada vez que se cambia la ubicación del usuario. 
*/
import React, {useState, useEffect} from "react";
import { Layer, Source } from "react-map-gl";
import { BASE_URL } from "../services";
export default function DynamicBuffer({coords, radius, ...props}) {

    const [auxData, setAuxData] = useState([])

    useEffect(() => {
        console.log(coords);
        fetch(`${BASE_URL}/layers/getMyBuffer/?latitude=${coords.lat}&longitude=${coords.lng}&radius=${radius || 5000}`)
        .then(res => res.json())
        .then(
            (result) => {
            setAuxData(result);
        }).catch(err => {
            console.log(err);
        }
        )

    }, [coords,radius])

    return (
        auxData[0] &&
            <Source id="bufferLocationUCA" type="geojson" data={auxData[0]} >
            <Layer id="bufferLocationUCA" type="fill" paint={{'fill-color': '#007cbf', 'fill-opacity': 0.2, "fill-outline-color" : "blue"}} {...props} />
        </Source>
        
    );


}