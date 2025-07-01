import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function SignupForm(props) {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [email, setEmail] = useState('');
const [showPassword, setShowPassword] = useState(false);
const styles = props.styles

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
            <form id="signupForm" onSubmit={handleSubmit}>
            <div className={styles.inpWrap}>
                <div className={styles.inpContent}>
                <label htmlFor="signupEmail">Email</label><br/>
                <input 
                    type="text" 
                    id={styles.authEmail} 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br/>
                </div>

                <div className={styles.inpContent}>
                <label htmlFor="signupUser">Username</label><br/>
                <input 
                    type="text" 
                    id={styles.authUser} 
                    name="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                /><br/>
                </div>
                
                <div className={styles.inpContent}>
                <label htmlFor="signupPass">Password</label><br/>
                <div className={styles.passWrap}>
                    <input 
                    type={showPassword ? "text" : "password"} 
                    id={styles.authPass} 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <span 
                    className={styles.visBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? "visibility_off" : "visibility"}
                    </span>
                </div>
                </div>
            </div>

            <div className={styles.centerWrap}>
                <input id={styles.authBtn} type="submit" value="Sign Up" />
            </div>

            </form>


            <div className={styles.centerWrap}>
            <p>Already have an account? <a href="#" onClick={toggleView}>Log in</a></p>
            </div>
        </>
    )
}

export default SignupForm