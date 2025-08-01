import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
import { useOutletContext } from "react-router-dom"
import styles from "./HomePage.module.css";
import { useEffect, useContext, useState } from "react";
import { useToast } from "@/components/ui/Toaster";

/* Radix UI */
import ToggleSwitch from "@/components/ui/ToggleSwitch"
import UserAvatar from "@/components/ui/UserAvatar"
import NotifModal from "@/components/ui/NotifModal"
import ScheduleModal from "@/components/ui/ScheduleModal";
import ScrollableArea from "@/components/ui/ScrollableArea"

import { UserContext } from '@/components/UserProvider'

function HomePage() {
    const { user, setUser } = useContext(UserContext)
    const [upcomingGames, setUpcomingGames] = useState([])
    console.log('user upcoming games: ', user.currentlyQueued)
    console.log('user history: ', user.matchHistory)
    const [notifications, setNotifications] = useState([])
    const { showToast } = useToast();

    // useEffect(() => {
    //     const toastData = sessionStorage.getItem('createMatchSuccessToast');
    //     if (toastData) {
    //         const toast = JSON.parse(toastData);
    //         showToast(toast);
    //         sessionStorage.removeItem('createMatchSuccessToast');
    //     }
    // }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            if(user){
                try {
                    const res = await fetch(`http://localhost:5000/getNotifications/${user.username}`);
                    if (res.ok) {
                        const data = await res.json();
                        const formattedNotifications = data.map(n => ({
                            _id: n._id,
                            notification: `${n.message}`,
                        }));

                        setNotifications(formattedNotifications);
                    } else {
                        console.error("Failed to fetch notifications");
                        return null;
                    }
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            } else {
                setNotifications([]);
            }
        };

        const fetchUpcomingGames = async () => {
            if (user.currentlyQueued && user.currentlyQueued.length > 0) {
                try {
                    const gamePromises = user.currentlyQueued.map(async (gameId) => {
                        const res = await fetch(`http://localhost:5000/getFormattedGame/${gameId._id || gameId}`);
                        if (res.ok) {
                            return await res.json();
                        }
                        return null;
                    });
                    
                    const games = await Promise.all(gamePromises);
                    const validGames = games.filter(game => game !== null);

                    // Formatted for display
                    const formattedUpcomingGames = validGames.map(game => ({
                        _id: game._id,
                        displayGame: `${game.date} | ${game.start} at ${game.venue}`,
                    }));
                    setUpcomingGames(formattedUpcomingGames);
                } catch (err) {
                    console.error("Error fetching upcoming games:", err);
                }
            } else {
                setUpcomingGames([]);
            }
        };

        fetchNotifications();
        fetchUpcomingGames();
    }, [user.currentlyQueued]); // dependency variable

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className={styles.MainDiv}>
                <div className={styles.Content}>
                    <article className={styles.ScrollTabs}>
                        <ScrollableArea 
                            tabName="Notifications"
                            tabHeight="40"
                            tabWidth="40"
                            data={notifications}
                            displayText="notification" // or message, if preferred
                        />
                        
                        <ScrollableArea 
                            tabName="Upcoming Games" 
                            tabHeight="40" 
                            tabWidth="40"
                            data={upcomingGames}
                            path="games"
                            param="_id"
                            displayText="displayGame"/>
                    </article>
                    {/* { (user.position !== 'guest') &&
                        <article className={styles.Buttons}>
                            <ScheduleModal userId={user.idNum} onSuccess={() => window.location.reload()} />
                            <input type="button" value="Generate Member Report" />
                        </article>
                    } */}
                </div>
            </div>
            {/* Uncomment to view components*/}
            {/* <div style={{backgroundColor: "lightyellow", padding: "2rem"}}>
                <ToggleSwitch btnLabel="sample" btnName="Sample Toggle"></ToggleSwitch>
                <UserAvatar userImg="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" initials="TadadsD"></UserAvatar>
                <NotifModal></NotifModal>
            </div>  */}
        </motion.div>
    )
}

export default HomePage