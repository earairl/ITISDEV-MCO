// Import necessary React features and assets
import { useState } from 'react'; 
/* read more into useState in react, but its basically where you
put dynamic data, like a counter or using it like a conditional*/
import shuttlesyncLogo from '../assets/shuttlesync.png';
import '../../css/landing.css'; // stylesheet import

// This is the main functional component
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // function to handle submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { username, password });
    // login logic here
  };

//  SAME FUNCTION AS ABOVE, just in the more traditional notation
//   function handleSubmit(e) {
//     e.preventDefault();
//     console.log('Login attempted with:', { username, password });
//     // login logic here
// }

  //vvv The JSX (UI) to be rendered by the component
  return (
    // basically return your html layout here
    <div>
      <div id="shuttlesync">
        {/* JSX allows embedding of JS expressions via {} */}
        <img src={shuttlesyncLogo} alt="ShuttleSync Logo" />
      </div>

      <div id="loginContent">
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="inpWrap">
            <div className="inpContent">
              <label htmlFor="loginUser">Username</label><br/>
              <input 
                type="text" 
                id="loginUser" 
                name="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              /><br/>
            </div>
            
            <div className="inpContent">
              <label htmlFor="loginPass">Password</label><br/>
              <div className="passWrap">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="loginPass" 
                  name="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span 
                  className="material-symbols-outlined visibilityBtn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </div>
            </div>
          </div>

          <div className="centerWrap">
            <input id="loginBtn" type="submit" value="Log In" />
          </div>
        </form>

        <div className="centerWrap">
          <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;