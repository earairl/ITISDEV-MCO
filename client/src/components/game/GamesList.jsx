import { GamePreview } from './GamePreview'

export function GamesList(props) {
    const games = props.games
    const styles = props.styles

    return (
        <>
            { games.length === 0 ?
                <tr>
                    <td colSpan={5}>No games found.</td>
                </tr>
                : <> 
                    {games.map(game => (
                        <GamePreview key={game._id} game={game} styles={styles} />
                    ))}
                </>
            }
        </>
    )
}