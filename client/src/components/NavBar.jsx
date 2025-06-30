import logo from '../assets/logo.png';

function NavBar(props) {
    return (
        <>
            <span 
                className="material-symbols-outlined"
                onClick={() => props.toggleSideNav()}
            >
                menu
            </span>

            {/* parent comp must pass <NavBar username={} />  */}
            <h1>Hello, <a>{props.username}</a></h1>

            <img src={logo} />
        </>
    )
}

export { NavBar }