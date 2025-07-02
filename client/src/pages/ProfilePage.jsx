import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
import styles from "./ProfilePage.module.css";

import ScrollableArea from "@/components/ui/ScrollableArea"

// implement conditionals to render variations of the page
// e.g. omitting a component if viewed as an officer, public user, etc.
function ProfilePage() {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <MainLayout>               
                <div className={styles.MainDiv}>
                    <div className={styles.Content}>
                        <header className={styles.ProfileHeader}>
                            <div>
                                <h1>John Doe</h1>
                                <h3>johndoe@gmail.com</h3>
                            </div>
                            <div>
                                <h2>Joined Feb 2023</h2>
                                <h2>Member</h2>
                            </div>
                        </header>
                        <article className={styles.ProfileStats}>
                            <h2>85% Attendance Rate</h2>
                            <h2>5/10 Penalties</h2>
                        </article>
                        <article className={styles.ScrollTabs}>
                            <ScrollableArea tabName="Current Games Queued" tabWidth="40"/>
                            <ScrollableArea tabName="Past Games Joined" tabWidth="40"/>
                        </article>
                        <article className={styles.Penalty}>
                            <input type="button" value="Assign Penalty" />
                        </article>
                    </div>
                </div>
            </MainLayout>    
        </motion.div>
    )
}

export default ProfilePage