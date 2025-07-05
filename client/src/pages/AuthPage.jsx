// react utils
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import classNames from 'classnames'

import styles from './AuthPage.module.css'

// custom components and utils
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { ShuttleSyncLogo } from '../components/ui/ShuttleSyncLogo'
import { GuestLoginBtn } from "@/components/auth/GuestLoginBtn"
import { useToast } from '@/components/ui/Toaster'

function AuthPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const visBtn = classNames('material-symbols-outlined', styles.visibilityBtn)
  const modifiedStyles = {
    ...styles,
    visBtn
  }

  useEffect(() => {
    setIsMounted(false)
  }, [])

  function toggleLogin() {
    setIsLogin(prev => !prev)
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
            <LoginForm toggleView={toggleLogin} styles={modifiedStyles} navigate={navigate} showToast={showToast} />
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
            <SignupForm toggleView={toggleLogin} styles={modifiedStyles} navigate={navigate} showToast={showToast} />
          </motion.div>
        )}
      </AnimatePresence>

      <GuestLoginBtn styles={styles} navigate={navigate} showToast={showToast} />

    </motion.div>
  );
}

export default AuthPage;