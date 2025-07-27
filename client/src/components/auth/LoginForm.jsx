import { useState, useContext } from 'react';
import { UserContext } from '@/components/UserProvider'

function LoginForm(props) {
    const navigate = props.navigate
    const styles = props.styles
    const showToast = props.showToast
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { user, setUser } = useContext(UserContext)

    async function handleSubmit(e) {
        e.preventDefault();

        showToast({
            description: 'Logging in...',
        })

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            showToast({
                description: data.message,
            })
            if (response.ok) {
                sessionStorage.setItem('isLoggedIn', true);
                setUser(data.user);
                navigate('/home', { state: { fromAuth: true } });
            }
        } catch (err) {
            console.error('Login error:', err);
            showToast({
                title: 'Login Error',
                description: err,
            })
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
                        id="loginUser"
                        type="text" 
                        className={styles.authUser}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    /><br/>
                </div>
                
                <div className={styles.inpContent}>
                    <label htmlFor="loginPass">Password</label><br/>
                    <div className={styles.passWrap}>
                        <input 
                            id="loginPass"
                            type={showPassword ? "text" : "password"} 
                            className={styles.authPass} 
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
