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

        const url = 'http://localhost:3000/api/v1/users/signup'

        const newUser = {
            "name": username,
            "email": email,
            "password": password
        };

        try {
            const { data } = await axios.post(url, newUser).then(response => {
                Swal("Success", "User Created!", "success")
            });;

            setFailure(false)
            setSuccess(true)

        } catch (err) {
            setFailure(true)
            setSuccess(false)
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
