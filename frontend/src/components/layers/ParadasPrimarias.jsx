/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/* 
    En esta clase se define la capa que muestra las paradas primarias en el mapa de la aplicación web
*/

import React , { useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl";
import { BASE_URL } from "../../services";
export default function ParadasPrimarias({...props}) {

    const [ data, setData ] = useState([])


    useEffect(() => {
        fetch(`${BASE_URL}/layers/getParadasPrimarias`)
        .then(res => res.json())
        .then(
            (result) => {
                setData(result)
            }
        ).catch((err) => {
            console.log(err)
        })
    }, [])
    // paint={{'circle-radius': 5, 'circle-color': '#FFA500'}}
    return(
        data[0] &&
        <Source id="paradasPrimarias" type="geojson" data={data[0]} >
            <Layer  id="paradasPrimarias" type="circle"  paint={{'circle-radius': 5, 'circle-color': '#FFA500'}} {...props}/>
        </Source>
    )
}