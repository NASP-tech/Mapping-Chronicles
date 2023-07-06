/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/*
    Este componente se encarga de mostrar las rutas primarias en el mapa.
*/
import React, {useEffect, useState} from "react";
import { Layer, Source } from "react-map-gl";
import { BASE_URL } from "../../services";
export default function RutasPrimariasLayer({ idRouteSelected, ...props }) {

    const [ data, setData ] = useState([])
    const [ id, setId ] = useState(1)
    useEffect(() => {
        fetch(`${BASE_URL}/layers/getRutasPrimarias`)
        .then(res => res.json())
        .then(
            (result) => {
                setData(result)
            }
        ).catch((err) => {
            console.log(err)
        }
        )
    }, [])

    useEffect(() => {
        console.log(idRouteSelected)
        setId(idRouteSelected || 1)
    },[idRouteSelected])

    // 'paint={{'line-color': '#3bff6f', 'line-width': 1}}

    return(
        data[0] &&
        <Source id="rutasPrimarias" type="geojson" data={data[0]} >
            <Layer id="rutasPrimarias" type="line" 
                paint={
                    {'line-color': [
                        'match',
                        ['get', 'FID'],
                        id, 'red',
                        '#3bff6f',
                    ], 'line-width': [
                        'match',
                        ['get', 'FID'],
                        id, 6,
                        2,
                    ]}}{...props} />
        </Source>
        )
    }
    