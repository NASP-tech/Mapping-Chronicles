import { Room } from "@material-ui/icons"
import "./register.css"
import { useRef, useState } from "react"
import axios from "axios";
import Swal from 'sweetalert';

export default function Register() {

    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)
    // const nameRef = useRef()
    // const emailRef = useRef()
    // const passwordRef = useRef()

    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const url = 'http://localhost:5000/api/users/register'

        const newUser = {
            "username": username,
            "email": email,
            "password": password
        };

        try {
            const { data } = await axios.post(url, newUser).then(response => {
                Swal("Success", "User Created!", "success")
            });;
            console.log(data)
            setFailure(false)
            setSuccess(true)
        } catch (err) {
            Swal("Error", "User Creation Failed!, Already register with E-mail", "error")
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
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)} />
                <input
                    type="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)} />
                <input
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} />
                <button
                    className="registerBtn"
                    type="submit"
                >Register
                </button>
            </form>

        </div>
    )
}