import React, {useState, useEffect} from "react"
import { Layer, Source } from "react-map-gl";

export default function MyBusStops({coords, radius, idPointSelected }){

    const [id, setId ] = useState(1);
    const [ data, setData ] = useState([])

    useEffect(() => {
        fetch(`http://localhost:5000/api/layers/getBusStopsByRadius/?latitude=${coords.lat}&longitude=${coords.lng}&radius=${radius || 5000}`)
        .then(res => res.json())
        .then(
            (result) => {
            setData(result);
        }).catch(err => {
            console.log(err);
        }
        )

    },[coords, radius])

    useEffect(() => {
        setId(idPointSelected || 1)
    },[idPointSelected])



    return (
        data[0] &&
            <Source  id="myBusStops" type="geojson" data={data[0]} >
            <Layer  id="myBusStops" type="circle" 
            paint=
            {
                { 'circle-color': [
                    'match',
                    ['get', 'id'], 
                    id, 'red',
                    'blue',
                ], 'circle-radius': 5, 'circle-stroke-width': 1, 'circle-stroke-color': 'white'}} />
        </Source>
    )
}


//paint={{'circle-radius': 5, 'circle-color': '#FFA500'}}
// paint={{'circle-color': '#007cbf', 'circle-radius': 5, 'circle-stroke-width': 1, 'circle-stroke-color': '#fff'}} 