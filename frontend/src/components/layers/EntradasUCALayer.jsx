import React, {useEffect, useState} from "react";
import { Layer, Source } from "react-map-gl";

export default function EntradasUCALayer({...props}) {

    const [ data , setData ] = useState({})
    
    useEffect(() => {
        fetch("http://localhost:5000/api/entradasUCA")
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                setData(result)
            }
        ).catch((err) => {
            console.log(err)
        })
    }, [])


    return(
        <Source id="entradasUCA" type="geojson" data={data[0]} >
            <Layer  id="entradasUCA" type="circle" paint={{'circle-radius': 5, 'circle-color': '#007cbf'}} {...props}/>
        </Source>
        )
    }