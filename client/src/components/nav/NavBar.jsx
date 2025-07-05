import logo from '../../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import styles from './NavBar.module.css'

function NavBar(props) {
    const navigate = useNavigate()
    const location = useLocation()
    const menuBtn = classNames('material-symbols-outlined', styles.menuBtn)

    // debugging purposes
    // console.log('Location context:', location);

    return (
        <header className={styles.navBarWrap}>
            <div className={styles.navBarLeft}>
                <span 
                    className={menuBtn}
                    onClick={() => props.toggleSideNav()}
                >
                    menu
                </span>

                {( props.position === 'guest' ?
                    <h1 className={styles.navBarUser}>ShuttleSync</h1> 
                    :
                    <h1 className={styles.navBarUser}>Hello, <a href={`/profile/${props.username}`}>{props.username}</a></h1>
                )}
            </div>

            <div className={styles.navBarRight}>
                <img 
                    className={styles.navBarLogo} 
                    src={logo} 
                    onClick={ () => { props.position === 'guest' ?
                        navigate('/games')
                        : navigate('/home')
                    }}
                />
            </div>
        </header>
    )
}

export { NavBar }