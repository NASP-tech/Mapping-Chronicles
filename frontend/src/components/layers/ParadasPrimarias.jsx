import React , { useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl";
import { BASE_URL } from "../../services";
export default function ParadasPrimarias({...props}) {

    const [ data, setData ] = useState([])


    useEffect(() => {
        fetch(`${BASE_URL}/paradasPrimarias`)
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