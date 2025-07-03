import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
import styles from "./ProfilePage.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react"; // useState: stores data that changes, useEffect: run code in response to comp

import ScrollableArea from "@/components/ui/ScrollableArea"

// implement conditionals to render variations of the page
// e.g. omitting a component if viewed as an officer, public user, etc.
function ProfilePage() {
    const { username } = useParams();
    const [email, setEmail] = useState(""); // email initialized to "", setEmail: for updating value

    useEffect(() => {
    const storedUser = sessionStorage.getItem("user"); // 
    if (storedUser) {
        const user = JSON.parse(storedUser); //turn JSON string into JS object
        setEmail(user.email); // get email from sessionStorage
    }
    }, []); // [] makes effect runs once after first render

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
                                <h1>{ username }</h1>
                                <h3>{ email }</h3>
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