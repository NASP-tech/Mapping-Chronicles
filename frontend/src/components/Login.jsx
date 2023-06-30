import { Cancel, Room } from "@material-ui/icons"
import "./login.css"
import { useState } from "react"
import axios from "axios";
import Swal from 'sweetalert';

export default function Login({ setShowLogin, myStorage, setUsername }) {
    const [failure, setFailure] = useState(false)
    const [user, setUser] = useState(null)
    const [password, setPassword] = useState(null)

    const userInfo = JSON.parse(myStorage.getItem("user"))

    const handleSubmit = async (e) => {
        e.preventDefault()

        const url = 'http://localhost:3000/api/users/login'

        const loggedUser = {
            "username": user,
            "password": password
        };

        try {
            const { data } = await axios.post(url, loggedUser);
            myStorage.setItem("user", JSON.stringify(data.username));
            setUsername(data.username);
            setShowLogin(false);
            setFailure(false);
            Swal.fire("Success", "User Logged!", "success");
        } catch (error) {
            console.log(error);
            Swal({
                icon: 'error',
                title: 'Error',
                text: 'Failed to LogIn. Please try again.',
            });
        }


        window.location.reload()
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
                    placeholder="username"
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
