export function GameTabs(props) {
    const styles = props.styles
    const user = props.user
    const tabs = ['all', 'open', 'full',
        ...(user.position === 'officer' ?
            ['closed', 'cancelled']
            : []
        ),
    ]

    return (
        <div className={styles.tabsWrap}>
            {tabs.map(tab => (
                <button
                    key={tab}
                    className={props.filter === tab ? styles.active : ''}
                    onClick={() => props.setFilter(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}