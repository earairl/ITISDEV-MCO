import EditGameForm from './EditGameForm'

export function GameInfo(props) {
    const game = props.game
    const styles = props.styles
    const user = props.user
    const fetchGame = props.fetchGame

    return (
        <div className={styles.GameInfoWrap}>
            <h1>
                Game Information
                { user.position === 'officer' && game.status !== 'closed' && game.status !== 'cancelled' &&
                    <span>
                        <EditGameForm userId={user.idNum} game={game} onSuccess={fetchGame} />
                    </span>
                }
            </h1>
            <ul>
                <li><b>Venue: </b>{game.venue}</li>
                <li><b>Date: </b>{game.date}</li>
                <li><b>Time: </b>{game.start} - {game.end}</li>
                <li><b>Status: </b>{game.status}</li>
            </ul>
        </div>
    )
}