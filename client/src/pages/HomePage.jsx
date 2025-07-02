import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
import styles from "./HomePage.module.css";

/* Radix UI */
import ToggleSwitch from "@/components/ui/ToggleSwitch"
import UserAvatar from "@/components/ui/UserAvatar"
import NotifModal from "@/components/ui/NotifModal"
import ScrollableArea from "@/components/ui/ScrollableArea"

function HomePage() {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <MainLayout>
                <div className={styles.MainDiv}>
                    <div className={styles.Content}>
                        <article className={styles.ScrollTabs}>
                            <ScrollableArea tabName="Current Games Queued" tabHeight="40" tabWidth="40"/>
                            <ScrollableArea tabName="Past Games Joined" tabHeight="40" tabWidth="40"/>
                        </article>
                        <article className={styles.Buttons}>
                            <input type="button" value="Create New Schedule" />
                            <input type="button" value="Generate Member Report" />
                        </article>
                    </div>
                </div>
                {/* Uncomment to view components*/}
                {/* <div style={{backgroundColor: "lightyellow", padding: "2rem"}}>
                    <ToggleSwitch btnLabel="sample" btnName="Sample Toggle"></ToggleSwitch>
                    <UserAvatar userImg="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" initials="TadadsD"></UserAvatar>
                    <NotifModal></NotifModal>
                </div> */}
            </MainLayout>    
        </motion.div>
    )
}

export default HomePage