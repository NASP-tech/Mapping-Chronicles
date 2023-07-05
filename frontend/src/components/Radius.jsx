import React from "react";
import "./Radius.css";
export default function Radius({setRadius, radius, ...props}){

    


    return(
        <div className="radius">
            <b htmlFor="radius">Radio de búsqueda</b>
            <input type="number" id="radius" name="radius" min="0" max="10000" value={radius} onChange={(e) => setRadius(e.target.value)} {...props}/>
            <b htmlFor="radius">metros</b>
        </div>
    )
}