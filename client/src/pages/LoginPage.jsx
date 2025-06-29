// Import necessary React features and assets
import LoginForm from "@/components/LoginForm";
import shuttlesyncLogo from '../assets/shuttlesync.png';
/* read more into useState in react, but its basically where you
put dynamic data, like a counter or using it like a conditional*/
import '../../css/landing.css'; // stylesheet import

// This is the main functional component
function LoginPage() {
  //vvv The JSX (UI) to be rendered by the component
  return (
    // basically return your html/jsx layout here
    <div id="login-body">
      <div id="shuttlesync">
        {/* JSX allows embedding of JS expressions via {} */}
        <img src={shuttlesyncLogo} alt="ShuttleSync Logo" />
      </div>

      <div id="loginContent">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;