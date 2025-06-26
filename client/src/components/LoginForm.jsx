import { useState } from 'react';

function LoginForm() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);

// function to handle submission
function handleSubmit(e) {
    e.preventDefault();
    console.log('Login attempted with:', { username, password });
    // login logic here
}

    return (
        /* The tag <></> are shorthand for <React.fragment></React.fragment>
        that allows grouping elements without adding an extra element like a div */
        <> 
            <form id="loginForm" onSubmit={handleSubmit}>
            <div className="inpWrap">
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
                <input id="loginBtn" type="submit" value="Log In" />
            </div>
            </form>
            <div className="centerWrap">
            <p>Don't have an account? <a href="#">Sign up</a></p>
            </div>
        </>

    )
}

export default LoginForm