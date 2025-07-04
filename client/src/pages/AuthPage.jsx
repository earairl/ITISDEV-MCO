import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { motion, AnimatePresence } from 'motion/react'

import { useToast } from '@/components/ui/Toaster'

// Import necessary React features and assets
import styles from './AuthPage.module.css'
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { ShuttleSyncLogo } from '../components/ui/ShuttleSyncLogo'

// This is the main functional component
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const { showToast } = useToast()

  useEffect(() => {
    setIsMounted(false)
  }, [])

  const navigate = useNavigate()

  const visBtn = classNames('material-symbols-outlined', styles.visibilityBtn)
  const modifiedStyles = {
    ...styles,
    visBtn
  }

  function toggleLogin() {
    setIsLogin(!isLogin)
  }

  return (
    <motion.div 
      className={styles.authBody}

      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >
      
      <ShuttleSyncLogo styles={styles} />

      <AnimatePresence mode='wait'>
        {isLogin ? (
          <motion.div
            key='loginForm'
            className={styles.authContent}

            initial={ isMounted ? { x: -100, opacity: 0 } : false } 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <LoginForm toggleView={toggleLogin} styles={modifiedStyles} />
          </motion.div>
        ) : (
          <motion.div
            key='signupForm'
            className={styles.authContent}

            initial={{ x: -100, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: 100, opacity: 0 }} 
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <SignupForm toggleView={toggleLogin} styles={modifiedStyles} />
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        className={styles.guestBtn} 
        onClick={() => {
          navigate('/games')
          showToast({
              description: 'Logged in as guest',
          })
        }}
      >
        <span className="material-symbols-outlined">
        account_circle
        </span>
        Login as Guest
      </button>

    </motion.div>
  );
}

export default AuthPage;