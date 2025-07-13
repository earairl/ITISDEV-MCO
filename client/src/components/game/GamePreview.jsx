import { Link } from 'react-router-dom'

export function GamePreview(props) {
    const game = props.game

    return (
        <tr className='relative'>
            <td>{game.date}</td>
            <td>{game.time}</td>
            <td>{game.venue}</td>
            <td>{game.players} / {game.maxPlayers}</td>
            <td>{game.status}</td>

            <td className="absolute inset-0">
                <Link 
                    to={`/games/${game.id}`}
                    className="absolute inset-0"
                />
            </td>
        </tr>
    )
}