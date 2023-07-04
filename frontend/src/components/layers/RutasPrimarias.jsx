/*
    Este componente se encarga de mostrar las rutas primarias en el mapa.
*/
import React, {useEffect, useState} from "react";
import { Layer, Source } from "react-map-gl";
import { BASE_URL } from "../../services";
export default function RutasPrimariasLayer({ ...props }) {

    const [ data, setData ] = useState([])

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

    return(
        data[0] &&
        <Source id="rutasPrimarias" type="geojson" data={data[0]} >
            <Layer id="rutasPrimarias" type="line" paint={{'line-color': '#3bff6f', 'line-width': 1}} {...props} />
        </Source>
        )
    }
    