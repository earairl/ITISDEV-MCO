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
    const [dateJoined, setDateJoined] = useState("");
    const [isMember, setIsMember] = useState(false); 
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");

        if (storedUser) {
            const user = JSON.parse(storedUser); //turn JSON string into JS object

            if (user.username === username)
                setEmail(user.email);
            else
                setEmail(""); // no show email if username is not logged in user
        }

        async function fetchUserData() {
            try {
                const userRes = await fetch(`http://localhost:5000/user/userId/${username}`);
                if (!userRes.ok) return;
                const data = await userRes.json();
                const memberRes = await fetch(`http://localhost:5000/member/by-idnum/${data.userId}`);
                const memberData = await memberRes.json();
                if (memberData?.memberInfo) {
                    setIsMember(true);
                    setDateJoined(new Date(memberData.memberInfo.dateJoined).toLocaleDateString("en-US", { month: "short", year: "numeric" }));
                } else {
                    setIsMember(false); 
                    setDateJoined("");  
                }

            } catch (err) {
                console.error("Error fetching profile data:", err);
            }
        }
        fetchUserData();
    }, [username]); // runs whenever the username in url changes

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <MainLayout>
                <div className={styles.MainDiv}>
                    <div className={styles.Content}>
                        <header className={styles.ProfileHeader}>
                            <div>
                                <h1>{username}</h1>
                                <h3>{email}</h3>
                            </div>
                            <div>
                                {isMember && (
                                    <>
                                        <h2>Joined {dateJoined}</h2>
                                        <h2>Member</h2>
                                    </> 
                                )}
                            </div>
                        </header>
                        <article className={styles.ProfileStats}>
                            <h2>85% Attendance Rate</h2>
                            <h2>5/10 Penalties</h2>
                        </article>
                        <article className={styles.ScrollTabs}>
                            <ScrollableArea tabName="Current Games Queued" tabWidth="40" />
                            <ScrollableArea tabName="Past Games Joined" tabWidth="40" />
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