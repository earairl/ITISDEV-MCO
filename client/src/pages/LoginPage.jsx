import { useState } from 'react'

// Import necessary React features and assets
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import shuttlesyncLogo from '../assets/shuttlesync.png';
/* read more into useState in react, but its basically where you
put dynamic data, like a counter or using it like a conditional*/
import '../../css/landing.css'; // stylesheet import

/* Radix imports */
import ToggleSwitch from "@/components/ui/ToggleSwitch"
import UserAvatar from "@/components/ui/UserAvatar"
import NotifModal from "@/components/ui/NotifModal"

// This is the main functional component
function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  function toggleLogin() {
    setIsLogin(!isLogin)
  }

  //vvv The JSX (UI) to be rendered by the component
  return (
    // basically return your html/jsx layout here
    <div id="login-body">
      <div id="shuttlesync">
        {/* JSX allows embedding of JS expressions via {} */}
        <img src={shuttlesyncLogo} alt="ShuttleSync Logo" />
      </div>

      <div id="loginContent">
        {isLogin ? <LoginForm toggleView={toggleLogin}/> : <SignupForm toggleView={toggleLogin}/>}

        {/* Sample Modified Radix Components */}
        <ToggleSwitch btnLabel="sample" btnName="Sample Toggle"></ToggleSwitch>
        <UserAvatar userImg="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" initials="TadadsD"></UserAvatar>
        <NotifModal></NotifModal>
      </div>
    </div>
  );
}

export default LoginPage;