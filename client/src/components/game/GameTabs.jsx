export function GameTabs(props) {
    const tabs = ['all', 'open', 'full']

    return (
        <div>
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => props.onChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}