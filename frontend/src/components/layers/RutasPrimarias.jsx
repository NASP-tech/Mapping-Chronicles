/*
    Este componente se encarga de mostrar las rutas primarias en el mapa.
    Se utiliza el hook useState para almacenar los datos de la capa
    Se utiliza el hook useEffect para realizar la petición de los datos al servidor
    Se utiliza el componente Source para definir la fuente de los datos
    Se utiliza el componente Layer para definir la capa de los datos
    Se utiliza el componente BASE_URL para definir la ruta base de la petición
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
    