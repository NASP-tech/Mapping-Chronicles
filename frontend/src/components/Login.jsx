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

        const url = 'http://localhost:5000/api/users/login'

        const loggedUser = {
            "username": user,
            "password": password
        };

        try {
            const { data } = await axios.post(url, loggedUser)
                .then(response => {
                    myStorage.setItem("user", JSON.stringify(response.data.username))
                    setUsername(data.username)
                    setShowLogin(false)
                    setFailure(false)

                })
                // myStorage.setItem("user", res.data.username)
                // myStorage.setItem("user", JSON.stringify(data.user))
                .then(res => {
                    Swal("Success", "User Logged!", "success")
                })
        }
        catch (err) {
            console.log(err)
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