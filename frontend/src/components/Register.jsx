import { Room } from "@material-ui/icons"
import "./register.css"

export default function Register(){
    
    return(
        <div className="registerContainer">
            <div className="logo">
                <Room/>
                Chronicles Mapping App
            </div>
            <form>
                <input type="text" placeholder="username"/>
                <input type="email" placeholder="email"/>
                <input type="password" placeholder="password"/>
                <button className="registerBtn">Register</button>
                <span className="success">Successfull. You can login now!</span>
                <span className="failure">Something went wrong!</span>
            </form>

        </div>
    )
}