import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react'
import { UserContext } from '@/components/UserProvider'

function SignupForm(props) {
    const navigate = props.navigate
    const styles = props.styles
    const showToast = props.showToast
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [activeIdInp, setActiveIdInp] = useState(false);
    const { user, setUser } = useContext(UserContext)

    async function handleSubmit(e) {
        e.preventDefault();
        
        showToast({
            description: 'Signing up...',
        })
        
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    userId: activeIdInp ? userId : '', 
                    username, 
                    email, 
                    password, 
                    password2,
                    activeIdInp, }),
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
            console.error('Signup error:', err);
            showToast({
                title: 'Signup Error',
                description: err,
            })
        }
    }

    function toggleView(e) {
        e.preventDefault()
        props.toggleView()
    }

    function toggleUserIdInp() {
        setActiveIdInp(prev => !prev)
    }

    return (
        <> 
            <form onSubmit={handleSubmit}>
            <div className={styles.inpWrap}>
                <div className={styles.inpContent}>
                    <label htmlFor="signupEmail">Email</label><br/>
                    <input 
                        id="signupEmail"
                        type="text" 
                        className={styles.authEmail} 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br/>
                </div>

                <div className={styles.inpContent}>
                    <label htmlFor="signupUser">Username</label><br/>
                    <input 
                        id="signupUser"
                        type="text" 
                        className={styles.authUser} 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    /><br/>
                </div>
                
                <div className={styles.inpContent}>
                    <label htmlFor="signupPass">Password</label><br/>
                    <div className={styles.passWrap}>
                        <input 
                            id="signupPass"
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

                <div className={styles.inpContent}>
                    <label htmlFor="signupPass2">Confirm Password</label><br/>
                    <div className={styles.passWrap}>
                        <input 
                            id="signupPass2"
                            type={showPassword2 ? "text" : "password"} 
                            className={styles.authPass} 
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                        />
                        <span 
                            className={styles.visBtn}
                            onClick={() => setShowPassword2(!showPassword2)}
                        >
                        {showPassword2 ? "visibility_off" : "visibility"}
                        </span>
                    </div><br/>
                </div>
            </div>

            <label className={styles.userIdInp}>
                <input
                    type='checkbox'
                    checked={activeIdInp}
                    onChange={() => toggleUserIdInp()}
                />
                Currently a member of DLSU Badminton Society
            </label>

            <AnimatePresence>
                {activeIdInp && (
                    <motion.div 
                        className={styles.inpContent}
                        key='userIdInp'
                        initial={{ opacity: 0, y: -100}}
                        animate={{ opacity: 1, y: 0}}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        <label htmlFor="signupUserId">Full ID Number</label><br/>
                        <input 
                            id="signupUserId"
                            type="text" 
                            className={styles.authUserId} 
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div layout transition={{ duration: 0.4, ease: 'easeOut' }} className={styles.centerWrap}>
                <input className={styles.authBtn} type="submit" value="Sign Up" />
            </motion.div>

            </form>

            <div className={styles.centerWrap}>
            <p>Already have an account? <a href="#" onClick={toggleView}>Log in</a></p>
            </div>
        </>
    )
}

export default SignupForm