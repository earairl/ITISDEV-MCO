import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function SignupForm(props) {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [email, setEmail] = useState('');
const [showPassword, setShowPassword] = useState(false);
const styles = props.styles
let userId; // after the 1st step of registration phase, the user must be asked if he's a member or not. If he's a member, an idNum will be required.

const navigate = useNavigate()

// function to handle submission
async function handleSubmit(e) {
    e.preventDefault();
    console.log('Signup attempted with:', { username, password });

    // registration logic
    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userId, username, email, password }),
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            sessionStorage.setItem('userId', data.userId);
            navigate('/home');
        }
    } catch (err) {
        console.error('Register error:', err);
        alert('Register error');
    }
}

function toggleView(e) {
    e.preventDefault()
    props.toggleView()
}

    return (
        <> 
            <form onSubmit={handleSubmit}>
            <div className={styles.inpWrap}>
                <div className={styles.inpContent}>
                <label htmlFor="signupEmail">Email</label><br/>
                <input 
                    type="text" 
                    className={styles.authEmail} 
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
                    className={styles.authUser} 
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
                    className={styles.authPass} 
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
                <input className={styles.authBtn} type="submit" value="Sign Up" />
            </div>

            </form>


            <div className={styles.centerWrap}>
            <p>Already have an account? <a href="#" onClick={toggleView}>Log in</a></p>
            </div>
        </>
    )
}

export default SignupForm