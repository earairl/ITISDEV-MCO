import { useNavigate } from 'react-router-dom';

import styles from './SideNavBar.module.css'

function SideNavBar(props) {
    const actions = [
        { label: 'Home', path: '/home' },
        { label: 'Profile', path: `/profile/${props.username}` },
        ...(props.position === 'officer' ?
            [
                { label: 'Database', path: '/database' },
            ] :
            []
        ),
        { label: 'Log out', path: '/' }
    ]

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
                navigate('/');
            }
        } catch (err) {
            console.error('Logout error:', err);
            alert('Logout error');
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.navBarWrap}>
                <span 
                    className="material-symbols-outlined"
                    onClick={() => props.toggleSideNav()}
                >
                    close
                </span>
                <ul>
                    {actions.map((action, index) => (
                        <li key={index}>
                            {action.label === 'Log out' ? (
                                <a href="#" onClick={handleLogout}>
                                    {action.label}
                                </a>
                            ) : (
                                <a href={action.path}>{action.label}</a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export { SideNavBar } 