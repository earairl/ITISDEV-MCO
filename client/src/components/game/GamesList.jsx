import { GamePreview } from './GamePreview'

export function GamesList(props) {
    const games = props.games

    return (
        <>
            { games.length === 0 ?
                <tr>
                    <td colSpan={5}>No games found.</td>
                </tr>
                : <> 
                    {games.map(game => (
                        <GamePreview key={game.id} game={game} />
                    ))}
                </>
            }
        </>
    )
}