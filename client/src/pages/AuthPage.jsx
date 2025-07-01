import { useState } from 'react'
import classNames from 'classnames'
import { motion, AnimatePresence } from 'motion/react'

// Import necessary React features and assets
import styles from './AuthPage.module.css'
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { ShuttleSyncLogo } from '../components/ui/ShuttleSyncLogo'

/* Radix imports */
import ToggleSwitch from "@/components/ui/ToggleSwitch"
import UserAvatar from "@/components/ui/UserAvatar"
import NotifModal from "@/components/ui/NotifModal"

// This is the main functional component
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
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
      
      {/* not yet final animation */}
      <motion.div 
        layout
      >
        <ShuttleSyncLogo styles={styles} />
      </motion.div>

      <AnimatePresence mode='wait'>
        {isLogin ? (
          <motion.div
            key='loginForm'
            className={styles.authContent}

            initial={{ x: -100, opacity: 0 }} 
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

      <ToggleSwitch btnLabel="sample" btnName="Sample Toggle"></ToggleSwitch>
      <UserAvatar userImg="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" initials="TadadsD"></UserAvatar>
      <NotifModal></NotifModal>

    </motion.div>
  );
}

export default AuthPage;