/* 
    En esta clase se define la capa que muestra el buffer de 100 metros de las entradas a la UCA en el mapa dinámico de la aplicación web
    Se utiliza el hook useState para almacenar los datos de la capa en el estado auxData
    Se utiliza el hook useEffect para realizar la petición de los datos al servidor cada vez que cambia el estado de coords o radius (radio del buffer)
    Se utiliza el componente Source para definir la fuente de los datos de la capa auxData en el mapa
    Se utiliza el componente Layer para definir la capa de los datos de la capa auxData en el mapa
    Se utiliza el componente BASE_URL para definir la ruta base de la petición al servidor
*/
import React, {useState, useEffect} from "react";
import { Layer, Source } from "react-map-gl";
import { BASE_URL } from "../services";
export default function DynamicBuffer({coords, radius, ...props}) {

    const [auxData, setAuxData] = useState([])

    useEffect(() => {
        console.log(coords);
        fetch(`${BASE_URL}/layers/getMyBuffer/?latitude=${coords.lat}&longitude=${coords.lng}&radius=${radius || 5000}`)
        .then(res => res.json())
        .then(
            (result) => {
            setAuxData(result);
        }).catch(err => {
            console.log(err);
        }
        )

    }, [coords,radius])

    return (
        auxData[0] &&
            <Source id="bufferLocationUCA" type="geojson" data={auxData[0]} >
            <Layer id="bufferLocationUCA" type="fill" paint={{'fill-color': '#007cbf', 'fill-opacity': 0.2, "fill-outline-color" : "blue"}} {...props} />
        </Source>
        
    );


}