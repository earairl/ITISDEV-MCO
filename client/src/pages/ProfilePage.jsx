import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
import styles from "./ProfilePage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react"; // useState: stores data that changes, useEffect: run code in response to comp
import editIcon from "@/assets/edit.png";
import { useToast } from '@/components/ui/Toaster';
import { UserContext } from '@/components/UserProvider';

import ScrollableArea from "@/components/ui/ScrollableArea"
import SelectMenu from "@/components/ui/SelectMenu";
import AlertModal from "@/components/ui/AlertModal";
import ConfirmationForm from '@/components/ui/ConfirmationForm'

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
    const { user, setUser } = useContext(UserContext);
    const [attendanceRate, setAttendanceRate] = useState(null);
    const [penalties, setPenalties] = useState([]);
    const [isEditing, setIsEditing]   = useState(false);
    const [draftEmail, setDraftEmail] = useState("");
    const [pendingPosition, setPendingPosition] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const inputRef = useRef(null);
    const { showToast } = useToast();
    // const [loading, setLoading] = useState(true); // prevent non-existent page from loading in

    const [modalOpen, setModalOpen] = useState(false)
    const [modalAction, setModalAction] = useState('')
    const [modalObject, setModalObject] = useState('')

    function openConfirmation(action, object) {
        setModalAction(action)
        setModalObject(object)
        setModalOpen(true)
    }

    useEffect(() => {
        async function fetchProfileData() {
            try {
                if (user.username === username) {
                    setEmail(user.email || "");
                }

                // Fetch user being viewed
                const res = await fetch(`http://localhost:5000/getUser?username=${username}`);
                if (!res.ok) {
                    setIsMember(false);
                    setPosition("");
                    setDateJoined("");
                    navigate("/notFound", { replace: true });
                    return;
                }

                const data = await res.json();
                const userInfo = data.userInfo;

                setEmail(userInfo?.email ?? "");

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
                } else {
                    setIsMember(false);
                    setPosition("");
                    setDateJoined("");
                    setIdNum("");
                }

                if (userInfo.attendanceRate !== undefined) {
                    setAttendanceRate(userInfo.attendanceRate);
                }

                if (Array.isArray(userInfo.penalties)) {
                    setPenalties(userInfo.penalties);
                }

                // Fetch current games
                if (userInfo.currentlyQueued && userInfo.currentlyQueued.length > 0) {
                    try {
                        const gamePromises = userInfo.currentlyQueued.map(async (gameId) => {
                            const res = await fetch(`http://localhost:5000/getFormattedGame/${gameId._id || gameId}`);
                            if (res.ok) {
                                return await res.json();
                            }
                            return null;
                        });

                        const games = await Promise.all(gamePromises);
                        const validGames = games.filter(game => game !== null);

                        const formattedCurrentGames = validGames.map(game => ({
                            _id: game._id,
                            displayGame: `${game.date} | ${game.start} at ${game.venue}`,
                        }));

                        setCurrentGames(formattedCurrentGames);
                    } catch (err) {
                        console.error("Error fetching upcoming games:", err);
                        setCurrentGames([]);
                    }
                } else {
                    setCurrentGames([]);
                }

                // Fetch past games
                if (userInfo.matchHistory && userInfo.matchHistory.length > 0) {
                    try {
                        const pastGamesPromises = userInfo.matchHistory.map(async (gameId) => {
                            const res = await fetch(`http://localhost:5000/getFormattedGame/${gameId._id || gameId}`);
                            if (res.ok) {
                                return await res.json();
                            }
                            return null;
                        });

                        const pastGames = await Promise.all(pastGamesPromises);
                        const validPastGames = pastGames.filter(game => game !== null);

                        const formattedPastGames = validPastGames.map(game => ({
                            _id: game._id,
                            displayGame: `${game.date} | ${game.start} at ${game.venue}`,
                        }));

                        setPastGames(formattedPastGames);
                    } catch (err) {
                        console.error("Error fetching past games:", err);
                        setPastGames([]);
                    }
                } else {
                    setPastGames([]);
                }

            } catch (err) {
                console.error("Error fetching profile data:", err);
                setIsMember(false);
                setDateJoined("");
                setCurrentGames([]);
                setPastGames([]);
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
                if (user.username === username) {
                    setUser({ ...user, email: trimmedEmail });
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
    
    const handleChangePosition = async (newPosition) => {
        try {
            const res = await fetch('http://localhost:5000/updatePosition', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ idNum, position: newPosition})
            });
            if (res.ok) {
                setPosition(newPosition)
                showToast({
                    description: "Role applied successfully",
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

    // Intercept SelectMenu change
    const handleSelectChange = (newPosition) => {
        setPendingPosition(newPosition);
        setShowConfirmDialog(true);
    };

    const handleConfirmPosition = async () => {
        await handleChangePosition(pendingPosition);
        setShowConfirmDialog(false);
        setPendingPosition(null);
    };

    const handleCancelPosition = () => {
        setShowConfirmDialog(false);
        setPendingPosition(null);
        showToast({
            description: "Role assignment cancelled"
        });
    };

    async function handleConfirm() {
        try {
            const res = await fetch(`http://localhost:5000/deleteUser/${username}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
            })

            const data = await res.json()
            showToast({ description: data.message })

            if (res.ok) {
                navigate('/')
            }
        } catch (err) {
            console.error('Error deleting user: ', err)
        }
        setModalOpen(false);
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
                                    {user.username === username && (
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
                            {user.username !== username && user.position === "officer" ? (
                                    <SelectMenu position={position} 
                                                onChange={handleSelectChange} 
                                                value={position}/>
                            // consider using state variable for value if using more complex UI/needing better control
                            ) : (
                                <h2>{position}</h2>
                            )}
                        </div>
                    </header>
                    {(user.username === username || user.position === "officer") && (
                        <article className={styles.ProfileStats}>
                            <h2>{`${Math.round(attendanceRate * 100)}% Attendance Rate`}</h2>
                            <h2>{`${penalties.length}/10 Penalties`}</h2>
                        </article>
                    )}
                    <article className={styles.ScrollTabs}>
                        <ScrollableArea tabName="Current Games Queued" 
                                        tabWidth="40" 
                                        data={currentGames}
                                        path="games"
                                        param="_id"
                                        displayText="displayGame"
                                        noDataMsg="No Current Games"/>
                        <ScrollableArea tabName="Past Games Joined"
                                        tabWidth="40"
                                        data={pastGames}
                                        path="games"
                                        param="_id"
                                        displayText="displayGame"
                                        noDataMsg="No Game History"/>
                    </article>
                    {user.username !== username && user.position === "officer" && (
                        <article className={styles.Penalty}>
                            <input type="button" value="Assign Penalty" />
                        </article>
                    )}
                    {/* Position Set Confirmation */}
                    {showConfirmDialog && (
                        <AlertModal
                            open={showConfirmDialog}
                            onOpenChange={setShowConfirmDialog}
                            title="Confirm Position Change"
                            description={`Are you sure you want to change this member's position to "${pendingPosition}"? This action is irreversible.`}
                            onConfirm={handleConfirmPosition}
                            onCancel={handleCancelPosition}
                        />
                    )}

                    {(user.username === username) && (
                        <button className={styles.DeleteBtn} onClick={() => openConfirmation('delete', 'your account')}>Delete My Account</button>
                    )}
                </div>
            </div>
            <ConfirmationForm
                open={modalOpen}
                setOpen={setModalOpen}
                action={modalAction}
                object={modalObject}
                onConfirm={handleConfirm}
            />
        </motion.div>
    )
}

export default ProfilePage