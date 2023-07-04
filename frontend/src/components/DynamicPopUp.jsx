/*
    Se utiliza el hook useState para almacenar los datos de la capa
    Se utiliza el hook useEffect para realizar la petición de los datos al servidor
    Se utiliza el componente Source para definir la fuente de los datos
    Se utiliza el componente Layer para definir la capa de los datos
    Se utiliza el componente BASE_URL para definir la ruta base de la petición
*/
import React from "react";
import { Popup } from "react-map-gl";

export default function DynamicPopUp ({coords,  feature, ...props }) {
    
    console.log(feature)

    return (
        <Popup
            tipSize={20}
            anchor="bottom-right"
            closeOnClick={false}
            closeButton={true}
            {...props}
        >
            <div className="popup">
              <h3>Parada</h3>
              <p>{feature.properties.NA2}</p>
              <h5>Dirección</h5>
              <p>{feature.properties.Parada_PGO} </p>
              {feature.properties.km &&   <p>Distancia ruta completa: {Math.round(feature.properties.km)} km </p>}
            </div>
        </Popup>
    );
    }