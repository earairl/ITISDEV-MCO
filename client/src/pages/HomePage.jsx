import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
import { useOutletContext } from "react-router-dom"
import styles from "./HomePage.module.css";

/* Radix UI */
import ToggleSwitch from "@/components/ui/ToggleSwitch"
import UserAvatar from "@/components/ui/UserAvatar"
import NotifModal from "@/components/ui/NotifModal"
import ScrollableArea from "@/components/ui/ScrollableArea"

function HomePage() {
    const user = useOutletContext()

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
                    {console.log(user)}
                    { (user.position !== 'guest') &&
                        <article className={styles.Buttons}>
                            <input type="button" value="Create New Schedule" />
                            <input type="button" value="Generate Member Report" />
                        </article>
                    }
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