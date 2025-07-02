import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function LoginForm(props) {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate()
const styles = props.styles

// function to handle submission
async function handleSubmit(e) {
    e.preventDefault();
    console.log('Login attempted with:', { username, password });

    // login logic here
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            sessionStorage.setItem('isLoggedIn', true);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            navigate('/home');
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('Login error');
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
                <label htmlFor="loginUser">Username</label><br/>
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
                <label htmlFor="loginPass">Password</label><br/>
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
                <input className={styles.authBtn} type="submit" value="Log In" />
            </div>

            </form>
            <div className={styles.centerWrap}>
            <p>Don't have an account? <a href="#" onClick={toggleView}>Sign up</a></p>
            </div>
        </>
    )
}

export default LoginForm
