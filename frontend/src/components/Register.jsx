/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/*
    Este componente es el encargado de mostrar el formulario de registro de usuarios. 
*/
import { Cancel, Room } from "@material-ui/icons"
import "./register.css"
import { useState } from "react"
import axios from "axios";
import Swal from 'sweetalert';

export default function Register({ setShowRegister }) {

    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)
    const [username, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const url = 'http://localhost:3000/api/users/register'

        const newUser = {
            "username": username,
            "email": email,
            "password": password
        };

        try {

            const { data } = await axios.post(url, newUser);
            console.log(data);

            setFailure(false);
            setSuccess(true);
            Swal("Success", "User Created!", "success");
        } catch (error) {
            console.log(error);

            setFailure(true);
            setSuccess(false);
            Swal({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create user. Please try again.',
            });
        }

    }

    return (
        <div className="registerContainer">
            <div className="logo">
                <Room />
                Chronicles Mapping App
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)} />
                <input
                    type="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)} />
                <input
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} />
                <input
                    type="password"
                    placeholder="confirm password"
                    onChange={(e) => setPassword(e.target.value)} />
                <button
                    className="registerBtn"
                    type="submit"
                >Register
                </button>

                {
                    success && (
                        <span className="success"></span>
                    )
                }
                {
                    failure && (
                        <span className="failure"></span>
                    )
                }
            </form>

            <Cancel className="registerCancel" onClick={() => setShowRegister(false)} />

        </div>
    )
}
