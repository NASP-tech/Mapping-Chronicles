import { Cancel, Room } from "@material-ui/icons"
import "./login.css"
import {useState } from "react"
import axios from "axios";
import Swal from 'sweetalert';

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
    const [failure, setFailure] = useState(false)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const url = 'http://localhost:5000/api/users/login'

        const user = {
            "username": username,
            "password": password
        };

        try {
            const { data } = await axios.post(url, user).then(response => {
                Swal("Success", "User Logged!", "success")
            })
            myStorage.setItem("user", data.username)
            setCurrentUser(data.username)
            setShowLogin(false)
            setFailure(false)
            
        } catch (err) {
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
                    onChange={(e) => setUsername(e.target.value)} />
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
            <Cancel className="loginCancel" onClick={() => setShowLogin(false)}/>
        </div>
    )
}