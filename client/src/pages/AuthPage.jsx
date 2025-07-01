import { useState } from 'react'
import classNames from 'classnames'

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
    <div id={styles.authBody}>
      <ShuttleSyncLogo />
      
      <div id={styles.authContent}>
        {isLogin ? <LoginForm toggleView={toggleLogin} styles={modifiedStyles} /> : <SignupForm toggleView={toggleLogin} styles={modifiedStyles} />}

        {/* Sample Modified Radix Components */}
        <ToggleSwitch btnLabel="sample" btnName="Sample Toggle"></ToggleSwitch>
        <UserAvatar userImg="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" initials="TadadsD"></UserAvatar>
        <NotifModal></NotifModal>
      </div>
    </div>
  );
}

export default AuthPage;