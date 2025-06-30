import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom'

function NavBar(props) {
    const navigate = useNavigate()

    return (
        <>
            <span 
                className="material-symbols-outlined"
                onClick={() => props.toggleSideNav()}
            >
                menu
            </span>

            {/* parent comp must pass <NavBar username={} />  */}
            <h1>Hello, <a href={`/profile/${props.username}`}>{props.username}</a></h1>

            <img src={logo} onClick={() => navigate('/home')}/>
        </>
    )
}

export { NavBar }