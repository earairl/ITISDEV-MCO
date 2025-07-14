import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import { GamesList } from '../components/game/GamesList'
import { GameTabs } from '../components/game/GameTabs'
import ScheduleModal from "@/components/ui/ScheduleModal";

import styles from './GamesPage.module.css'

export default function GamesPage() {
    const user = useOutletContext()
    const [games, setGames] = useState([])
    const [filter, setFilter] = useState('all')

    const fetchGames = async () => {
        try {
            const res = await fetch("http://localhost:5000/getFormattedGames");
            const data = await res.json();
            setGames(data);
        } catch (err) {
            console.error("Error fetching games:", err);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const filteredGames = games.filter(game => {
        if (filter === 'all') return true
        return game.status === filter
    })

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Games</h1>
                <div>
                    { user.position === 'officer' &&
                        <ScheduleModal userId={user.idNum} onSuccess={fetchGames} />
                    }
                </div>
            </div>
            <GameTabs filter={filter} setFilter={setFilter} styles={styles} />
            <table className={styles.gamesTable}>
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
                    <GamesList games={filteredGames} styles={styles} />
                </tbody>
            </table>
        </div>
    )
}