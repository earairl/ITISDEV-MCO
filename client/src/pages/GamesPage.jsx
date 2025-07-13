import { useState } from 'react'

import { GamesList } from '../components/game/GamesList'
import { GameTabs } from '../components/game/GameTabs'

export default function GamesPage() {
    const [filter, setFilter] = useState('all')

    // fetch all games (open, full, and ongoing)
    const games = [
        { id: 1, date: '2025-07-15', time: '10:00 AM', venue: 'Hall A', status: 'open', players: 12, maxPlayers: 30 },
        { id: 2, date: '2025-07-16', time: '2:00 PM', venue: 'Hall B', status: 'full', players: 30, maxPlayers: 30 },
        { id: 3, date: '2025-09-16', time: '5:00 PM', venue: 'Hall C', status: 'open', players: 0, maxPlayers: 40 },
    ]

    // const games = []

    const filteredGames = games.filter(game => {
        if (filter === 'all') return true
        return game.status === filter
    })

    return (
        <>
            <h1>Games</h1>
            <GameTabs onChange={setFilter} />
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Venue</th>
                        <th>Players</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <GamesList games={filteredGames} />
                </tbody>
            </table>
        </>
    )
}