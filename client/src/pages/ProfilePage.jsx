import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
import styles from "./ProfilePage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // useState: stores data that changes, useEffect: run code in response to comp
import editIcon from "@/assets/edit.png";
import { useRef } from "react";
import { useToast } from '@/components/ui/Toaster';

import ScrollableArea from "@/components/ui/ScrollableArea"
import SelectMenu from "@/components/ui/SelectMenu";

// implement conditionals to render variations of the page
// e.g. omitting a component if viewed as an officer, public user, etc.
function ProfilePage() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [email, setEmail] = useState(""); // email initialized to "", setEmail: for updating value
    const [idNum, setIdNum] = useState("");
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
    // const [loading, setLoading] = useState(true); // prevent non-existent page from loading in

    useEffect(() => {
        async function fetchProfileData() {
            //setLoading(true);
            const storedUser = sessionStorage.getItem("user");

            // logged user
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
            // user being viewed
            try {
                const res = await fetch(`http://localhost:5000/getUser?username=${username}`);
                if (!res.ok) {
                    setIsMember(false)
                    setPosition("")
                    setDateJoined("")
                    navigate("/notFound", { replace: true });
                    return;
                }

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
                    setIdNum(userInfo.idNum);
                } else { // clear old data from state
                    setIsMember(false);
                    setPosition("");
                    setDateJoined("");
                    setIdNum("");
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
                description: err?.message || String(err) || "An unexpected error occurred."
            });
        }
    }
    
    const changePosition = async (newPosition) => {
        try {
            const res = await fetch('http://localhost:50010/updatePosition', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ idNum, position: newPosition})
            });
            if (res.ok) {
                setPosition(newPosition)
                showToast({
                    description: "Role applied successfully",
                    duration: 4000
                });
            } else {
                const data = await res.json();
                console.error(data.message || "Failed to update role")
                showToast({
                    title: "Failed to update role",
                    description: data.message || "An unknown error occurred."
                });
            }
        } catch (error) {
            showToast({
                title: "Error updating role",
                // optional chaining to display msg property of error Object, then typecasting if null/empty
                description: error?.message || String(error) || "An unexpected error occurred."
            });
            console.error(error)
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
                                    <div className={styles.EmailInputWrapper}>
                                        <input
                                            ref={inputRef}
                                            id="email-input"
                                            type="email"
                                            value={draftEmail}
                                            onChange={(e) => setDraftEmail(e.target.value)}
                                            className={styles.EmailInput}
                                        />
                                    </div> 

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
                            {loggedInUsername !== username && loggedInPosition === "officer" && position === "member" ? (
                                    <SelectMenu position={position} onChange={changePosition}/>
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