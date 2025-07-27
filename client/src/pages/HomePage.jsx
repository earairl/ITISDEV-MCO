import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
import { useOutletContext } from "react-router-dom"
import styles from "./HomePage.module.css";
import { useEffect, useContext } from "react";
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
    console.log('user upcoming games: ', user.currentlyQueued)
    console.log('user history: ', user.matchHistory)
    const { showToast } = useToast();

    // useEffect(() => {
    //     const toastData = sessionStorage.getItem('createMatchSuccessToast');
    //     if (toastData) {
    //         const toast = JSON.parse(toastData);
    //         showToast(toast);
    //         sessionStorage.removeItem('createMatchSuccessToast');
    //     }
    // }, []);

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className={styles.MainDiv}>
                <div className={styles.Content}>
                    <article className={styles.ScrollTabs}>
                        <ScrollableArea tabName="Notifications" tabHeight="40" tabWidth="40"/>
                        <ScrollableArea tabName="Upcoming Games" tabHeight="40" tabWidth="40"/>
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