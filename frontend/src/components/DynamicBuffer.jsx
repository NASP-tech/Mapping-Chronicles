import React, {useState, useEffect} from "react";
import { Layer, Source } from "react-map-gl";

export default function DynamicBuffer({coords, radius}) {

    const [auxData, setAuxData] = useState([])

    useEffect(() => {
        console.log(coords);
        fetch(`http://localhost:5000/api/layers/getMyBuffer/?latitude=${coords.lat}&longitude=${coords.lng}&radius=${radius || 5000}`)
        .then(res => res.json())
        .then(
            (result) => {
            setAuxData(result);
        }).catch(err => {
            console.log(err);
        }
        )

    }, [coords])

    return (
        auxData[0] &&
            <Source id="bufferLocationUCA" type="geojson" data={auxData[0]} >
            <Layer id="bufferLocationUCA" type="fill" paint={{'fill-color': '#007cbf', 'fill-opacity': 0.2, "fill-outline-color" : "blue"}} />
        </Source>
        
    );


}