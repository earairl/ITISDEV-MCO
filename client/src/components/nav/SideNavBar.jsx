import { useNavigate } from 'react-router-dom';
import classNames from 'classnames'

import styles from './SideNavBar.module.css'
import shuttlesyncGreen from '@/assets/shuttlesync-green.png'

import { SideBarActions } from './SideBarActions'

function SideNavBar(props) {
    const actions = [
        { label: 'Home', icon: 'home', path: '/' },
        ...(props.position !== 'guest' ?
            [
                { label: 'Profile', icon: 'account_box', path: `/profile/${props.username}` },
                ...(props.position === 'officer' ?
                    [
                        { label: 'Database', icon: 'database', path: '/database' },
                    ] :
                    []
                ),
            ] : 
            []
        ),
    ]

    const closeBtn = classNames("material-symbols-outlined", styles.closeBtn)

    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/logout', { 
                method: 'GET', 
                credentials  : 'include',
                headers: { 'Content-Type': 'application/json' }, 
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('user');
                navigate('/auth');
            }
        } catch (err) {
            console.error('Logout error:', err);
            alert('Logout error');
        }
    };

    return (
        <div className={styles.navBarWrap}>
            <span 
                className={closeBtn}
                onClick={() => props.toggleSideNav()}
            >
                close
            </span>

            <div>
                <div className={styles.navBarHeader}>
                    <img src={shuttlesyncGreen} />
                </div>
                <SideBarActions styles={styles} actions={actions} navigate={navigate} toggleSideNav={props.toggleSideNav} />
            </div>
            

            <ul className={styles.navBarActions}>
                {( props.position === 'guest' ?
                    <li key='login' className={styles.navBarAction} onClick={() => navigate('/auth')}>
                        <span className="material-symbols-outlined">
                            login
                        </span>
                        <a href='' onClick={() => navigate('/auth')}>
                            Log in
                        </a>
                    </li>
                   : 
                   <li key='logout' className={styles.navBarAction} onClick={(e) => handleLogout(e)}>
                        <span className="material-symbols-outlined">
                            logout
                        </span>
                        <a href="#" onClick={(e) => handleLogout(e)}>
                            Log out
                        </a>
                    </li>
                )}
            </ul>
        </div>
    )
}

export { SideNavBar } 