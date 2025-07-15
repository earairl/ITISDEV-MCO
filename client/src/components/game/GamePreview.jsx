import { Link } from 'react-router-dom'

export function GamePreview(props) {
    const game = props.game
    const styles = props.styles

    return (
        <tr className={styles.gameInfo}>
            <td>{game.date}</td>
            <td>{game.start} - {game.end}</td>
            <td>{game.venue}</td>
            <td>{game.players.length} / {game.maxPlayers}</td>
            <td>{game.status}</td>

            <td className={styles.gameLink}>
                <Link 
                    to={`/games/${game._id}`}
                    className={styles.gameLink}
                />
            </td>
        </tr>
    )
}