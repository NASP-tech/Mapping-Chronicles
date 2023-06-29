import React, {useEffect, useState} from "react";
import { Layer, Source } from "react-map-gl";
import { BASE_URL } from "../../services";

export default function BufferEntradasUCALayer({...props}) {

    const [ data, setData ] = useState({})

    useEffect(() => {
        fetch(`${BASE_URL}/bufferEntradasUCA`)
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
