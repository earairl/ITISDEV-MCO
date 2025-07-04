import MainLayout from "@/template/MainLayout";
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import styles from "./ProfilePage.module.css";         
import stylesDB from "./MemberDBPage.module.css";       

function MemberDBPage() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        async function fetchMembers() {
        try {
            const res = await fetch("http://localhost:5000/getMembers");
            const data = await res.json();
            setMembers(data);
        } catch (err) {
            console.error("Error fetching members:", err);
        }
        }
        fetchMembers();
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.MainDiv}>
            <div className={styles.Content}>
                <header className={styles.ProfileHeader}>
                <div>
                    <h1>Members Database</h1>
                    <h3>Total Members: {members.length}</h3>
                </div>
                </header>

                <div className={stylesDB.tableWrapper}>
                <table className={stylesDB.membersTable}>
                    <thead>
                    <tr className={stylesDB.headerRow}>
                        <th className={stylesDB.headerCell}>ID Number</th>
                        <th className={stylesDB.headerCell}>First Name</th>
                        <th className={stylesDB.headerCell}>Last Name</th>
                        <th className={stylesDB.headerCell}>College</th>
                        <th className={stylesDB.headerCell}>Position</th>
                        <th className={stylesDB.headerCell}>Date Joined</th>
                        <th className={stylesDB.headerCell}>Last Match</th>
                        <th className={stylesDB.headerCell}>Active</th>
                    </tr>
                    </thead>
                    <tbody>
                    {members.map((m) => (
                        <tr key={m._id} className={stylesDB.dataRow}>
                        <td className={stylesDB.dataCell}>{m.idNum}</td>
                        <td className={stylesDB.dataCell}>{m.firstName}</td>
                        <td className={stylesDB.dataCell}>{m.lastName}</td>
                        <td className={stylesDB.dataCell}>{m.college}</td>
                        <td className={stylesDB.dataCell}>{m.position}</td>
                        <td className={stylesDB.dataCell}>
                            {m.dateJoined ? new Date(m.dateJoined).toLocaleDateString() : ""}
                        </td>
                        <td className={stylesDB.dataCell}>
                            {m.lastMatchJoined ? new Date(m.lastMatchJoined).toLocaleDateString() : ""}
                        </td>
                        <td className={`${stylesDB.dataCell} ${stylesDB.iconCell}`}>{m.isActive ? 
                        <CheckIcon />: <Cross2Icon />}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </motion.div>
    );
}

export default MemberDBPage;