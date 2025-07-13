export function GameTabs(props) {
    const styles = props.styles
    const tabs = ['all', 'open', 'full']

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