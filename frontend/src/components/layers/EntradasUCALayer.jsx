/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/* 
    En esta clase se define la capa que muestra las entradas a la UCA en el mapa de la aplicación web 
*/
import React, {useEffect, useState} from "react";
import { Layer, Source } from "react-map-gl";
import { BASE_URL } from "../../services";
export default function EntradasUCALayer({...props}) {

    const [ data , setData ] = useState([])
    
    useEffect(() => {
        fetch(`${BASE_URL}/layers/getEntradasUCA`)
        .then(res => res.json())
        .then(
            (result) => {
                setData(result)
            }
        ).catch((err) => {
            console.log(err)
        })
    }, [])


    return(
        data[0] &&
        <Source id="entradasUCA" type="geojson" data={data[0]} >
            <Layer  id="entradasUCA" type="circle" paint={{'circle-radius': 5, 'circle-color': '#007cbf'}} {...props}/>
        </Source>
        )
    }