/*
    Este hook se encarga de manejar los cambios en los inputs de los formularios y de guardar los datos de los inputs en un objeto.
    Se utiliza el hook useState para guardar los datos de los inputs.
*/
import { useState } from 'react';

export const useForm = ( initialState = {} ) => {
    
    const [values, setValues] = useState(initialState);

    const reset = () => {
        setValues(initialState);
    }

    const handleInputChange = ({ target }) => {  
        setValues({
            ...values,
            [target.name]: target.value
        });
    }

    return [values, handleInputChange, reset];
}