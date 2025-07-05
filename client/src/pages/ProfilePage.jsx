import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
import styles from "./ProfilePage.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react"; // useState: stores data that changes, useEffect: run code in response to comp
import editIcon from "@/assets/edit.png";
import { useRef } from "react";
import { useToast } from '@/components/ui/Toaster';

import ScrollableArea from "@/components/ui/ScrollableArea"
import SelectMenu from "@/components/ui/SelectMenu";

// implement conditionals to render variations of the page
// e.g. omitting a component if viewed as an officer, public user, etc.
function ProfilePage() {
    const { username } = useParams();
    const [email, setEmail] = useState(""); // email initialized to "", setEmail: for updating value
    const [position, setPosition] = useState("");
    const [dateJoined, setDateJoined] = useState("");
    const [isMember, setIsMember] = useState(false);
    const [currentGames, setCurrentGames] = useState([]);
    const [pastGames, setPastGames] = useState([]);
    const [loggedInUsername, setLoggedInUsername] = useState("");
    const [loggedInPosition, setLoggedInPosition] = useState("");
    const [attendanceRate, setAttendanceRate] = useState(null);
    const [penalties, setPenalties] = useState([]);
    const [isEditing, setIsEditing]   = useState(false);
    const [draftEmail, setDraftEmail] = useState("");
    const inputRef = useRef(null);
    const { showToast } = useToast();

    useEffect(() => {
        async function fetchProfileData() {
            const storedUser = sessionStorage.getItem("user");

            if (storedUser) {
                const user = JSON.parse(storedUser);
                setLoggedInUsername(user.username);
                setEmail(user.username === username ? user.email : "");

                try {
                    const res = await fetch(`http://localhost:5000/getUser?username=${user.username}`);
                    if (res.ok) {
                        const data = await res.json();
                        setLoggedInPosition(data.userInfo.position);
                    }
                } catch (err) {
                    console.error("Error fetching logged-in user:", err);
                }
            }
            try {
                const res = await fetch(`http://localhost:5000/getUser?username=${username}`);
                if (!res.ok) return;

                const data = await res.json();
                const userInfo = data.userInfo;
                setEmail(userInfo?.email ?? "");

                //fetch games from backend

                if (userInfo.dateJoined) {
                    setIsMember(true);
                    setPosition(userInfo.position);
                    setDateJoined(
                        new Date(userInfo.dateJoined).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                        })
                    );
                } else {
                    setIsMember(false);
                    setPosition("");
                    setDateJoined("");
                }

                if (userInfo.attendanceRate !== undefined) {
                    setAttendanceRate(userInfo.attendanceRate);
                }

                if(Array.isArray(userInfo.penalties)) {
                    setPenalties(userInfo.penalties);
                }

            } catch (err) {
                console.error("Error fetching profile data:", err);
                setIsMember(false);
                setDateJoined("");
            }
        }

        fetchProfileData();
    }, [username]); // runs whenever the username in url changes

    function handleEditClick() {
        setDraftEmail(email);
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    async function handleSaveClick() {
        const trimmedEmail = draftEmail.trim();
        if (!trimmedEmail) { 
            setIsEditing(false);
            showToast({
                description: 'Email address cannot be empty.',
            });
            return;
        } else if (trimmedEmail === email) { 
            setIsEditing(false);
            showToast({
                description: 'No changes were made.',
            });
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/updateEmail", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, newEmail: trimmedEmail }),
            });

            const data = await res.json();
            showToast({
                description: data.message,
            });

            if (res.ok) {
                setEmail(trimmedEmail);
                const saved = sessionStorage.getItem("user");
                if (saved) {
                    const updated = { ...JSON.parse(saved), email: trimmedEmail };
                    sessionStorage.setItem("user", JSON.stringify(updated));
                }
                setIsEditing(false);
            } else {
                console.error("Failed to update email. Server returned:", res.status);
            }
        } catch (err) {
            console.error("Email update failed:", err);
            showToast({
                title: 'Login Error',
                description: err,
            });
        }
    }

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
                            <div className={styles.EmailRow}>
                                {!isEditing && (
                                    <>
                                    <h3>{email}</h3>
                                    {loggedInUsername === username && (
                                        <button
                                            className={styles.EditIcon}
                                            aria-label="Edit E-mail address"
                                            type="button"
                                            onClick={handleEditClick}
                                        >
                                            <img src={editIcon} alt="Edit" className={styles.IconImage}/>
                                        </button>
                                    )}
                                    </>
                                )}

                                {isEditing && (
                                    <>
                                    <h3><input
                                        ref={inputRef}
                                        id="email-input"
                                        type="email"
                                        value={draftEmail}
                                        onChange={(e) => setDraftEmail(e.target.value)}
                                        className={styles.EmailInput}
                                    /></h3> 

                                    <button
                                        type="button"
                                        className={styles.Savebtn}
                                        onClick={handleSaveClick}
                                    >
                                        Save
                                    </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles.HeaderRight}>
                            {isMember && <h2>Joined {dateJoined}</h2>}
                            {loggedInUsername !== username && loggedInPosition === "officer" ? (
                                <SelectMenu position={position} />
                            ) : (
                                <h2>{position}</h2>
                            )}
                        </div>
                    </header>
                    {(loggedInUsername === username || loggedInPosition === "officer") && (
                        <article className={styles.ProfileStats}>
                            <h2>{`${Math.round(attendanceRate * 100)}% Attendance Rate`}</h2>
                            <h2>{`${penalties.length}/10 Penalties`}</h2>
                        </article>
                    )}
                    <article className={styles.ScrollTabs}>
                        <ScrollableArea tabName="Current Games Queued" tabWidth="40" data={currentGames} />
                        <ScrollableArea tabName="Past Games Joined" tabWidth="40" data={pastGames} />
                    </article>
                    {loggedInUsername !== username && loggedInPosition === "officer" && (
                        <article className={styles.Penalty}>
                            <input type="button" value="Assign Penalty" />
                        </article>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default ProfilePage