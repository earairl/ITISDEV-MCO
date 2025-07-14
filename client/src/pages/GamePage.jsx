import { useParams, useOutletContext } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { useToast } from '@/components/ui/Toaster'
import ScrollableArea from '@/components/ui/ScrollableArea'

export default function GamePage() {
    const user = useOutletContext()
    const [game, setGame] = useState(null)
    const { gameId } = useParams()
    const { showToast } = useToast()

    const fetchGame = async () => {
        try {
            const res = await fetch(`http://localhost:5000/getFormattedGame/${gameId}`);
            const data = await res.json();
            setGame(data);
        } catch (err) {
            console.error("Error fetching game:", err);
        }
    };

    useEffect(() => {
        if (gameId) {
            fetchGame();
        }
    }, [gameId]);

    async function joinGame() {
        try {
            const res = await fetch('http://localhost:5000/joinMatch', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ username: user.username, gameId })
            })

            const data = await res.json()
            showToast({ description: data.message })

            if (res.ok) {
                await fetchGame()
            }
        } catch (err) {
            console.error('Error joining game: ', err)
        }
    }

    return (
        <>
            { game ? (
                <>
                    <button onClick={joinGame}>Register</button>
                    <ScrollableArea tabName={'Registered Players'} data={game.players} path={'profile'} param={'username'} />
                    <ScrollableArea tabName={'Waitlisted Players'} data={game.waitlist} path={'profile'} param={'username'} />
                </>
            ) : ( <></> )
            }
        </>
    )
}