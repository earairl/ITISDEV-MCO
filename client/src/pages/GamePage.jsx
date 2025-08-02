import { useParams, useOutletContext, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import styles from './GamePage.module.css'

import { useToast } from '@/components/ui/Toaster'
import ScrollableArea from '@/components/ui/ScrollableArea'
import { GameInfo } from '@/components/game/GameInfo'
import ConfirmationForm from '@/components/ui/ConfirmationForm'

import { UserContext } from '@/components/UserProvider'

export default function GamePage() {
    const { user, setUser } = useContext(UserContext)
    const [game, setGame] = useState(null)
    const { gameId } = useParams()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const [modalOpen, setModalOpen] = useState(false)
    const [modalAction, setModalAction] = useState('')
    const [modalObject, setModalObject] = useState('')
    const [newStatus, setNewStatus] = useState('')

    function openConfirmation(action, object, status) {
        setModalAction(action)
        setModalObject(object)
        setNewStatus(status)
        setModalOpen(true)
    }

    async function handleConfirm() {
        try {
            const res = await fetch('http://localhost:5000/updateMatchStatus', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ gameId, status: newStatus })
            })

            const data = await res.json()
            showToast({ description: data.message })

            if (res.ok) {
                navigate('/games')
            }
        } catch (err) {
            console.error('Error editing game: ', err)
        }
        setModalOpen(false);
    }

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
        if (user.position === 'guest') {
            showToast({ description: 'Must be logged in to register' })
            return navigate('/')
        }

        if (user.position === 'non-member' && !game.allowOutsiders) {
            showToast({
                description: 'This game is only exclusive to BadSoc members.',
                variant: 'destructive'
            })
            return
        }
        
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
                // console.log('user joined: ', data.user.userInfo)
                setUser(data.user.userInfo)
            }
        } catch (err) {
            console.error('Error joining game: ', err)
        }
    }

    async function leaveGame() {
        try {
            const res = await fetch('http://localhost:5000/leaveMatch', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ username: user.username, gameId })
            })

            const data = await res.json()
            showToast({ description: data.message })

            if (res.ok) {
                await fetchGame()
                // console.log('user left: ', data.user.userInfo)
                setUser(data.user.userInfo)
            }
        } catch (err) {
            console.error('Error leaving game: ', err)
        }
    }

    return (
        <>
            { game ? (
                <article className={styles.MainDiv}>
                    <div className={styles.GameDetails}>
                        <div className={styles.GameDetailsHeader}>
                            <GameInfo styles={styles} game={game} user={user} fetchGame={fetchGame} />
                            { user.position === 'officer' && game.status !== 'closed' && game.status !== 'cancelled' ?
                                <div className={styles.BtnsWrap}>
                                    <button className={styles.Btn} onClick={() => openConfirmation('close', 'registration', 'closed')}>Close Registration</button>
                                    <button className={styles.Btn} onClick={() => openConfirmation('delete', 'game schedule', 'cancelled')}>Cancel Game</button>
                                </div> : <></>
                            }
                        </div>
                        <div className={styles.PlayerListsWrap}>
                            <ScrollableArea tabName={'Registered Players'}
                                            data={game.players}
                                            path={'profile'}
                                            param={'username'}
                                            noDataMsg="No Registered Players"/>
                            <ScrollableArea tabName={'Waitlisted Players'}
                                            data={game.waitlist}
                                            path={'profile'}
                                            param={'username'}
                                            noDataMsg="None on List"/>
                        </div>
                    </div>
                    { game.status !== 'closed' && game.status !== 'cancelled' ?
                        <div className={styles.BtnsWrap}>
                            { game.players.some(p => p.username === user.username) || game.waitlist.some(p => p.username === user.username) ?
                                <button className={styles.RegisterBtn} onClick={leaveGame}>Cancel Registration</button>
                                :
                                <button className={styles.RegisterBtn} onClick={joinGame}>Register</button>
                            }
                            {/* prepping for future addtl buttons */}
                        </div> : <></>
                    }
                </article>
                ) : ( <></> )
            }
            <ConfirmationForm
                open={modalOpen}
                setOpen={setModalOpen}
                action={modalAction}
                object={modalObject}
                onConfirm={handleConfirm}
            />
        </>
    )
}