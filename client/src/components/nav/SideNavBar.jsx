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

    return (
        <>
            <span 
                className="material-symbols-outlined"
                onClick={() => props.toggleSideNav()}
            >
                close
            </span>
            <ul>
                {actions.map((action, index) => (
                    <li key={index}>
                        <a href={action.path}>{action.label}</a>
                    </li>
                ))}
            </ul>
        </>
    )
    
}

export { SideNavBar } 