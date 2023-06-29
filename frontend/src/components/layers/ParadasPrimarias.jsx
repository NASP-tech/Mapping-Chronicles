import React , { useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl";

export default function ParadasPrimarias({...props}) {

    const [ data, setData ] = useState([])


    useEffect(() => {
        fetch("http://localhost:5000/api/paradasPrimarias")
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
        data[0] &&
        <Source id="paradasPrimarias" type="geojson" data={data[0]} >
            <Layer  id="paradasPrimarias" type="circle" paint={{'circle-radius': 5, 'circle-color': '#FFA500'}} {...props}/>
        </Source>
    )
}