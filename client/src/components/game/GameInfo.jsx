export function GameInfo(props) {
    const game = props.game
    const styles = props.styles

    return (
        <div className={styles.GameInfoWrap}>
            <h1>Game Information</h1>
            <ul>
                <li><b>Venue: </b>{game.venue}</li>
                <li><b>Date: </b>{game.date}</li>
                <li><b>Time: </b>{game.start} - {game.end}</li>
            </ul>
        </div>
    )
}