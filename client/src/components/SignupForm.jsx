import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function SignupForm(props) {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [email, setEmail] = useState('');
const [showPassword, setShowPassword] = useState(false);

const navigate = useNavigate()

// function to handle submission
function handleSubmit(e) {
    e.preventDefault();
    console.log('Login attempted with:', { username, password });
    navigate('/home')
    // login logic here
}

function toggleView(e) {
    e.preventDefault()
    props.toggleView()
}

    return (
        <> 
            <form id="loginForm" onSubmit={handleSubmit}>
            <div className="inpWrap">
                <div className="inpContent">
                <label htmlFor="loginEmail">Email</label><br/>
                <input 
                    type="text" 
                    id="loginEmail" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br/>
                </div>

                <div className="inpContent">
                <label htmlFor="loginUser">Username</label><br/>
                <input 
                    type="text" 
                    id="loginUser" 
                    name="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                /><br/>
                </div>
                
                <div className="inpContent">
                <label htmlFor="loginPass">Password</label><br/>
                <div className="passWrap">
                    <input 
                    type={showPassword ? "text" : "password"} 
                    id="loginPass" 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <span 
                    className="material-symbols-outlined visibilityBtn"
                    onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? "visibility_off" : "visibility"}
                    </span>
                </div>
                </div>
            </div>

            <div className="centerWrap">
                <input id="loginBtn" type="submit" value="Sign Up" />
            </div>

            </form>


            <div className="centerWrap">
            <p>Already have an account? <a href="#" onClick={toggleView}>Log in</a></p>
            </div>
        </>
    )
}

export default SignupForm