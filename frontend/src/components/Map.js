/*
  En este componente se muestra el mapa de la ciudad, se utiliza la libreria de mapbox para mostrar el mapa y se utiliza la api de mapbox para obtener los datos de los buses y mostrarlos en el mapa. 
  Se utiliza el hook useEffect para inicializar el mapa y para actualizarlo cada vez que se cambia la ubicacion del usuario.
  Se utiliza el hook useState para guardar los datos de los buses y para guardar el mapa.
  Se utiliza el hook useRef para guardar la referencia del mapa.
  Se utiliza el hook useState para guardar el estado de los datos de los buses.
  Se utiliza el hook useState para guardar el estado del mapa.
  Se utiliza el hook useState para guardar el estado de los datos de los buses.

*/
import React, {useRef, useEffect, useState} from "react";
import mapboxgl from "mapbox-gl";
import './Map.css';
mapboxgl.accessToken = 'pk.eyJ1IjoibmF0c29scDc3IiwiYSI6ImNsaHF5ejBwYTBkajgzZG1yem02cXI2NW8ifQ.H2s0rN7AbaF2N2kRXWEkxA';


export default function Map ({coords, radius}) {

  const options = [
    {
      name: 'Population',
      description: 'Estimated total population',
      property: 'pop_est',
      stops: [
        [0, '#f8d5cc'],
        [1000000, '#f4bfb6'],
        [5000000, '#f1a8a5'],
        [10000000, '#ee8f9a'],
        [50000000, '#ec739b'],
        [100000000, '#dd5ca8'],
        [250000000, '#c44cc0'],
        [500000000, '#9f43d7'],
        [1000000000, '#6e40e6']
      ]
    },
    {
      name: 'GDP',
      description: 'Estimate total GDP in millions of dollars',
      property: 'gdp_md_est',
      stops: [
        [0, '#f8d5cc'],
        [1000, '#f4bfb6'],
        [5000, '#f1a8a5'],
        [10000, '#ee8f9a'],
        [50000, '#ec739b'],
        [100000, '#dd5ca8'],
        [250000, '#c44cc0'],
        [5000000, '#9f43d7'],
        [10000000, '#6e40e6']
      ]
    }
  ];

    const mapContainerRef = useRef(null);
    const [active, setActive] = useState(options[0]);

    const [map, setMap] = useState(null);
    
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/layers/getBusStopsByRadius/?latitude=${coords.lat || 13.68023 }&longitude=${coords.lng || -89.23624}&radius=${radius || 5000}`)
        .then(res => res.json())
        .then(
            (result) => {
            setData(result);
        }).catch(err => {
            console.log(err);
        }
        )

    },[coords, radius])

    // initialize map when component mounts
    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [-89.23624, 13.68023],
            zoom: 14,
        });

        map.on('load', () => {
            map.addSource('countries', {
              type: 'geojson',
              data : data[0],
            });


            // map.setLayoutProperty('country-label', 'text-field', [
            //     'format',
            //     ['get', 'name_en'],
            //     { 'font-scale': 1.2 },
            //     '\n',
            //     {},
            //     ['get', 'name'],
            //     {
            //       'font-scale': 0.8,
            //       'text-font': [
            //         'literal',
            //         ['DIN Offc Pro Italic', 'Arial Unicode MS Regular']
            //       ]
            //     }
            //   ]);

            map.addLayer(
                {
                  id: 'countries',
                  type: 'circle',
                  source: 'countries'
                },
                'country-label'
              );
            
            map.on('click', 'countries', e => {
              const feature = e.features[0];
              console.log(feature);
              new mapboxgl.Popup()
                .setLngLat(map.unproject(e.point))
                .setHTML(
                  `<h3>${feature.properties.NA2}</h3><p>${feature.properties.Ruta}</p><p>${feature}</p>`
                )
                .addTo(map);
            });

              map.setPaintProperty('countries', 'circle-color', 'red');
              
            
              setMap(map);
        })

        return () => map.remove();


    },[data])

    useEffect(() => {
        // paint();
      }, [active]);


      // const paint = () => {
      //   if (map) {
      //     map.setPaintProperty('countries', 'circle-color', '#ff0000');
      //   }
      // };
    
    //   const changeState = i => {
    //     setActive(options[i]);
    //     map.setPaintProperty('countries', 'fill-color', {
    //       property: active.property,
    //       stops: active.stops
    //     });
    //   };


    return(
        <div>
            <div ref={mapContainerRef} className="map-container" />
        
        </div>

    )

}

