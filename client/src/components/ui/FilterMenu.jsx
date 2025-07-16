import React, { useState } from "react";
import styles from "./FilterMenu.module.css";
const colleges = ["BAGCED", "CCS", "CLA", "COS", "GCOE", "RVRCOB", "SOE", "TDSOL"];
const positions = ["member", "officer"];

function FilterMenu({ members, setFilteredMembers, onClose }) {
    const [firstNameSort, setFirstNameSort] = useState("");
    const [lastNameSort, setLastNameSort] = useState("");
    const [college, setCollege] = useState("");
    const [position, setPosition] = useState("");
    const [status, setStatus] = useState("");
    const [dateJoined, setDateJoined] = useState({ from: "", to: "" });
    const [lastMatch, setLastMatch] = useState({ from: "", to: "" });

    const handleApply = () => {
        let filtered = [...members];

        if (college) 
            filtered = filtered.filter(m => m.college === college);
        if (position) 
            filtered = filtered.filter(m => m.position === position);
        if (status) filtered = filtered.filter(m => m.isActive === (status === "Active"));

        if (dateJoined.from)
            filtered = filtered.filter(m => m.dateJoined && new Date(m.dateJoined) >= new Date(dateJoined.from));
        if (dateJoined.to)
            filtered = filtered.filter(m => m.dateJoined && new Date(m.dateJoined) <= new Date(dateJoined.to));

        if (lastMatch.from)
            filtered = filtered.filter(m => m.lastMatchJoined && new Date(m.lastMatchJoined) >= new Date(lastMatch.from));
        if (lastMatch.to)
            filtered = filtered.filter(m => m.lastMatchJoined && new Date(m.lastMatchJoined) <= new Date(lastMatch.to));

        if (firstNameSort || lastNameSort) {
            filtered.sort((a, b) => {
                if (firstNameSort) {
                    const comp = a.firstName.localeCompare(b.firstName);
                    if (comp !== 0) return firstNameSort === "az" ? comp : -comp;
                }
                if (lastNameSort) {
                    const comp = a.lastName.localeCompare(b.lastName);
                    if (comp !== 0) return lastNameSort === "az" ? comp : -comp;
                }
                return 0;
            });
        }

        setFilteredMembers(filtered);
        onClose();
    };

    const resetAll = () => {
        setFirstNameSort("");
        setLastNameSort("");
        setCollege("");
        setPosition("");
        setStatus("");
        setDateJoined({ from: "", to: "" });
        setLastMatch({ from: "", to: "" });
        setFilteredMembers(members);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                <button className={styles.resetAll} onClick={resetAll}>RESET ALL</button>
                </div>

                <div className={styles.row}>
                <div className={styles.column}>
                    <label>First Name</label>
                    <div className={styles.sortOptions}>
                    <button onClick={() => setFirstNameSort("az")} className={firstNameSort === "az" ? styles.selected : ""}>A→Z</button>
                    <button onClick={() => setFirstNameSort("za")} className={firstNameSort === "za" ? styles.selected : ""}>Z→A</button>
                    </div>
                </div>

                <div className={styles.column}>
                    <label>Last Name</label>
                    <div className={styles.sortOptions}>
                    <button onClick={() => setLastNameSort("az")} className={lastNameSort === "az" ? styles.selected : ""}>A→Z</button>
                    <button onClick={() => setLastNameSort("za")} className={lastNameSort === "za" ? styles.selected : ""}>Z→A</button>
                    </div>
                </div>

                <div className={styles.column}>
                    <select value={college} onChange={(e) => setCollege(e.target.value)}>
                    <option value="">College</option>
                    {colleges.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select value={position} onChange={(e) => setPosition(e.target.value)}>
                    <option value="">All Positions</option>
                    {positions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    </select>
                </div>
                </div>

                <div className={styles.row}>
                <div className={styles.column}>
                    <label>Date Joined From</label>
                    <input
                    type="date"
                    value={dateJoined.from}
                    onChange={e => setDateJoined(prev => ({ ...prev, from: e.target.value }))}
                    />
                </div>
                <div className={styles.column}>
                    <label>Date Joined To</label>
                    <input
                    type="date"
                    value={dateJoined.to}
                    onChange={e => setDateJoined(prev => ({ ...prev, to: e.target.value }))}
                    />
                </div>
                <div className={styles.column}>
                    <button onClick={() => setDateJoined({ from: "", to: "" })} className={styles.reset}>
                    Reset
                    </button>
                </div>
                </div>

                <div className={styles.row}>
                <div className={styles.column}>
                    <label>Last Match From</label>
                    <input type="date" value={lastMatch.from} onChange={e => setLastMatch(prev => ({ ...prev, from: e.target.value }))} />
                </div>
                <div className={styles.column}>
                    <label>Last Match To</label>
                    <input type="date" value={lastMatch.to} onChange={e => setLastMatch(prev => ({ ...prev, to: e.target.value }))} />
                </div>
                <div className={styles.column}>
                    <button onClick={() => setLastMatch({ from: "", to: "" })} className={styles.reset}>
                    Reset
                    </button>
                </div>
                </div>

                <div className={styles.buttonGroup}>
                <button onClick={handleApply} className={styles.applyBtn}>Apply</button>
                <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default FilterMenu;