import React, {useEffect, useState} from "react";
import { Layer, Source } from "react-map-gl";


export default function BufferEntradasUCALayer({...props}) {

    const [ data, setData ] = useState({})

    useEffect(() => {
        fetch("http://localhost:5000/api/bufferEntradasUCA")
        .then(res => res.json())
        .then(
            (result) => {
                //console.log(result)
                setData(result)
            }
        ).catch((err) => {
            console.log("<<Error>>")
            console.log(err)
        }
        )
    }, [])

    return(
        { data } && 
        <Source id="bufferEntradasUCA" type="geojson" data={data[0] ? data[0] : {} } >
            <Layer id="bufferEntradasUCA" type="fill" paint={{'fill-color': '#007cbf', 'fill-opacity': 0.5}} {...props}/>
        </Source>
        )
    }
