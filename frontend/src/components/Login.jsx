/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/*
    Este componente se encarga de realizar el login de los usuarios en la aplicación web.
*/
import { Cancel, Room } from "@material-ui/icons"
import "./login.css"
import { useState } from "react"
import axios from "axios";
import swal from "sweetalert";

export default function Login({ setShowLogin, myStorage, setUsername }) {
    const [failure, setFailure] = useState(false)
    const [user, setUser] = useState(null)
    const [password, setPassword] = useState(null)

    const userInfo = JSON.parse(myStorage.getItem("user"))

    const handleSubmit = async (e) => {
        e.preventDefault()

        const url = 'http://localhost:3000/api/users/login'


        const loggedUser = {
            "email": user,
            "password": password
        };

        try {
            const { data } = await axios.post(url, loggedUser);
            myStorage.setItem("user", JSON.stringify(data.username));
            setUsername(data.username);
            setShowLogin(false);
            setFailure(false);
            swal("Success", "User Logged!", "success");
            window.location.reload()

        } catch (error) {
            console.log(error);
            swal({
                icon: 'error',
                title: 'Error',
                text: 'Failed to LogIn. Please try again.',
            });

        }


    }

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room />
                Chronicles Mapping App
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => setUser(e.target.value)} />
                <input
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} />
                <button
                    className="loginBtn"
                    type="submit"
                >Login
                </button>
                {failure && <span className="failure">Something went wrong!</span>}
            </form>
            <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
        </div>
    )
}
