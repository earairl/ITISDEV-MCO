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
                    <a href={action.path}>
                        {action.label}
                    </a>
                </li>
            ))}
        </ul>
    )
}

export { SideBarActions }