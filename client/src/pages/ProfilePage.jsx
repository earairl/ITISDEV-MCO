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
    const [position, setPosition] = useState("");
    const [dateJoined, setDateJoined] = useState("");
    const [isMember, setIsMember] = useState(false);

    /*const fetchUser = async (username) => {
        try {
            const response = await fetch(`http://localhost:5000/getUser?username=${username}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            if (response.ok) {
                setPosition(data.userInfo.position);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error');
        }
    };
    */

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");

        if (storedUser) {
            const user = JSON.parse(storedUser);
            setEmail(user.username === username ? user.email : "");
        }

        async function fetchUserProfile() {
            try {
                const res = await fetch(`http://localhost:5000/getUser?username=${username}`);
                if (!res.ok) return;

                const data = await res.json();
                const userInfo = data.userInfo;

                setPosition(userInfo.position || "Unknown");

                if (userInfo.dateJoined) {
                    setIsMember(true);
                    setDateJoined(
                        new Date(userInfo.dateJoined).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                        })
                    );
                } else {
                    setIsMember(false);
                    setDateJoined("");
                }

            } catch (err) {
                console.error("Error fetching profile data:", err);
                setIsMember(false);
                setDateJoined("");
            }
        }

        fetchUserProfile();
    }, [username]); // runs whenever the username in url changes

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className={styles.MainDiv}>
                <div className={styles.Content}>
                    <header className={styles.ProfileHeader}>
                        <div>
                            <h1>{username}</h1>
                            <h3>{email}</h3>
                        </div>
                        <div>
                            {isMember && <h2>Joined {dateJoined}</h2>}
                            <h2>{position}</h2>
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
        </motion.div>
    )
}

export default ProfilePage