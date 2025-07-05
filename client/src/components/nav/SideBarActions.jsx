import { Link } from 'react-router-dom';

function SideBarActions(props) {
    const styles = props.styles;
    const actions = props.actions;

    return (
        <ul className={styles.navBarActions}>
            {actions.map((action, index) => (
                <li 
                    key={index} 
                    className={styles.navBarAction} 
                    onClick={() => 
                        { 
                            props.toggleSideNav(); 
                            setTimeout(() => {
                                props.navigate(action.path);
                            }, 500);
                        } 
                    }
                >
                    <span className="material-symbols-outlined">
                        {action.icon}
                    </span>
                    <Link to={action.path}>
                        {action.label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export { SideBarActions }