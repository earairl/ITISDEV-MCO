import MainLayout from "@/template/MainLayout";
import { CheckIcon, Cross2Icon, Pencil2Icon, MagnifyingGlassIcon, CalendarIcon, TrashIcon } from '@radix-ui/react-icons';
import FacebookIcon from '@/assets/facebook.png'
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import styles from "./ProfilePage.module.css";         
import stylesDB from "./MemberDBPage.module.css"; 
import { useToast } from '@/components/ui/Toaster';   
import FilterMenu from "../components/ui/FilterMenu";

function MemberDBPage() {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loggedInPosition, setLoggedInPosition] = useState("");
    const [editingRow, setEditingRow] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await fetch("http://localhost:5000/getMembers");
                const data = await res.json();
                setMembers(data);
                setFilteredMembers(data);
            } catch (err) {
                console.error("Error fetching members:", err);
            }
        }

        async function fetchLoggedInUser() {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
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
        }

        fetchMembers();
        fetchLoggedInUser();
    }, []);

    // filter and search logic
    useEffect(() => {
        let filtered = [...members];

        // search filter
        if (searchTerm) {
            filtered = filtered.filter(member => 
                member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.idNum.includes(searchTerm)
            );
        }

        setFilteredMembers(filtered);
    }, [members, searchTerm]);

    const handleEditStart = (member) => {
        setEditingRow(member._id);
        setEditedData({
            firstName: member.firstName,
            lastName: member.lastName,
            college: member.college,
            position: member.position,
            contactNo: member.contactNo,
            email: member.email,
            fbLink: member.fbLink,
            telegram: member.telegram,
            dateJoined: member.dateJoined ? new Date(member.dateJoined).toISOString().split('T')[0] : '',
            lastMatchJoined: member.lastMatchJoined ? new Date(member.lastMatchJoined).toISOString().split('T')[0] : '',
            isActive: member.isActive
        });
    };

    const handleEditCancel = () => {
        setEditingRow(null);
        setEditedData({});
    };

    const handleEditSave = async (memberId) => {
        try {
            const member = members.find(m => m._id === memberId);
            if (!member) {
            return;
            }

            const response = await fetch('http://localhost:5000/updateMember', {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    idNum: member.idNum,
                    newFirstName: editedData.firstName,
                    newLastName: editedData.lastName,
                    newCollege: editedData.college,
                    newPosition: editedData.position,
                    newContactNo: editedData.contactNo,
                    newEmail: editedData.email,
                    newFbLink: editedData.fbLink,
                    newTelegram: editedData.telegram,
                    newDateJoined: editedData.dateJoined,
                    newLastMatchJoined: editedData.lastMatchJoined,
                    isActive: editedData.isActive
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                showToast({
                    description: data.message || 'Failed to update member',
                    variant: 'destructive'
                });
                return;
            }

            const membersRes = await fetch("http://localhost:5000/getMembers");
            if (membersRes.ok) {
                const updatedMembers = await membersRes.json();
                setMembers(updatedMembers);
                setFilteredMembers(updatedMembers);
            }
            
            setEditingRow(null);
            setEditedData({});

            const saved = sessionStorage.getItem("user");
            if (saved) {
                const updated = { ...JSON.parse(saved), dateJoined: editedData.dateJoined, email: editedData.email, position: editedData.position};
                sessionStorage.setItem("user", JSON.stringify(updated));
            }
            
            showToast({
                description: 'Member updated successfully',
            });

        } catch (error) {
            console.error("Update error:", error);
            showToast({
                description: 'Error updating member',
                variant: 'destructive'
            });
        }
    };

    const handleDeleteMember = async (idNum) => {
        if (!window.confirm("Are you sure you want to delete this member permanently?")) return;
        
        try {
            const response = await fetch('http://localhost:5000/removeMember', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ idNum })
            });

            const data = await response.json();
            
            if (!response.ok) {
                showToast({
                    description: data.message || 'Failed to delete member',
                    variant: 'destructive'
                });
                return;
            }

            // Refresh member list
            const membersRes = await fetch("http://localhost:5000/getMembers");
            const updatedMembers = await membersRes.json();
            
            setMembers(updatedMembers);
            setFilteredMembers(updatedMembers);
            
            showToast({
                description: 'Member deleted successfully',
            });

        } catch (error) {
            console.error("Delete error:", error);
            showToast({
                description: 'Error deleting member',
                variant: 'destructive'
            });
        }
    };

    const handleInputChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const colleges = ["BAGCED", "CCS", "CLA", "COS", "GCOE", "RVRCOB", "SOE", "TDSOL"];
    const positions = ["member", "officer"];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.MainDivDBPage}>
                <div className={styles.Content}>
                    <header className={styles.ProfileHeader}>
                        <div>
                            <h1>Members Database</h1>
                            <h3>Total Members: {filteredMembers.length}</h3>
                        </div>
                        <div className={stylesDB.headerControls}>
                            <div className={stylesDB.searchBar}>
                                <MagnifyingGlassIcon className={stylesDB.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={stylesDB.searchInput}
                                />
                            </div>
                            <button className={stylesDB.advancedFilterBtn} onClick={() => setShowFilter(!showFilter)}>
                                Advanced Filter
                            </button>
                            {showFilter && (
                                <FilterMenu
                                    members={members}
                                    setFilteredMembers={setFilteredMembers}
                                    onClose={() => setShowFilter(false)}
                                />
                            )}
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
                                    <th className={stylesDB.headerCell}>Contact No</th>
                                    <th className={stylesDB.headerCell}>Email</th>
                                    <th className={stylesDB.headerCell}>Facebook</th>
                                    <th className={stylesDB.headerCell}>Telegram</th>
                                    <th className={stylesDB.headerCell}>Date Joined</th>
                                    <th className={stylesDB.headerCell}>Last Match</th>
                                    <th className={stylesDB.headerCell}>Status</th>
                                    {loggedInPosition === "officer" && (
                                        <th className={stylesDB.headerCell}> </th> // space for the edit icon
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((m) => ( // loops through the filteredMembers array and generates a table row for each member
                                    <tr key={m._id} className={`${stylesDB.dataRow} ${stylesDB.hoverable}`}>
                                        
                                        <td className={stylesDB.dataCell}>{m.idNum}</td>
                                        
                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? ( // is the current row (m._id) being edited?
                                                <input
                                                    type="text"
                                                    value={editedData.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    className={stylesDB.editInput}
                                                />
                                            ) : (
                                                m.firstName
                                            )}
                                        </td>
                                        
                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    className={stylesDB.editInput}
                                                />
                                            ) : (
                                                m.lastName
                                            )}
                                        </td>
                                        
                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <select
                                                    value={editedData.college}
                                                    onChange={(e) => handleInputChange('college', e.target.value)}
                                                    className={stylesDB.editSelect}
                                                >
                                                    {colleges.map(college => (
                                                        <option key={college} value={college}>{college}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                m.college
                                            )}
                                        </td>
                                        
                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <select
                                                    value={editedData.position}
                                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                                    className={stylesDB.editSelect}
                                                >
                                                    {positions.map(position => (
                                                        <option key={position} value={position}>{position}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                m.position
                                            )}
                                        </td>

                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.contactNo || ''}
                                                    onChange={(e) => handleInputChange('contactNo', e.target.value)}
                                                    className={stylesDB.editInput}
                                                />
                                            ) : (
                                                m.contactNo
                                            )}
                                        </td>

                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="email"
                                                    value={editedData.email || ''}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className={stylesDB.editInput}
                                                />
                                            ) : (
                                                m.email
                                            )}
                                        </td>

                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.fbLink || ''}
                                                    onChange={(e) => handleInputChange('fbLink', e.target.value)}
                                                    className={stylesDB.editInput}
                                                />
                                            ) : (
                                                <a href={m.fbLink} target="_blank" rel="noopener noreferrer" className={stylesDB.fbContainer}>
                                                    <img src={FacebookIcon} className={stylesDB.fbIcon}/>
                                                </a>
                                            )}
                                        </td>

                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.telegram || ''}
                                                    onChange={(e) => handleInputChange('telegram', e.target.value)}
                                                    className={stylesDB.editInput}
                                                />
                                            ) : (
                                                m.telegram || "-"
                                            )}
                                        </td>

                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="date"
                                                    value={editedData.dateJoined}
                                                    onChange={(e) => handleInputChange('dateJoined', e.target.value)}
                                                    className={stylesDB.editInput}
                                                />
                                            ) : (
                                                m.dateJoined ? new Date(m.dateJoined).toLocaleDateString() : ""
                                            )}
                                        </td>
                                        
                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="date"
                                                    value={editedData.lastMatchJoined}
                                                    onChange={(e) => handleInputChange('lastMatchJoined', e.target.value)}
                                                    className={stylesDB.editInput}
                                                />
                                            ) : (
                                                m.lastMatchJoined ? new Date(m.lastMatchJoined).toLocaleDateString() : ""
                                            )}
                                        </td>
                                        
                                        <td className={stylesDB.dataCell}>
                                            {editingRow === m._id ? (
                                                <select
                                                    value={editedData.isActive ? "Active" : "Inactive"}
                                                    onChange={(e) => handleInputChange('isActive', e.target.value === "Active")}
                                                    className={stylesDB.editSelect}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            ) : (
                                                <span className={stylesDB.statusWrapper}>
                                                    {m.isActive ? "Active" : "Inactive"}
                                                </span>
                                            )}
                                        </td>
                                        
                                        {loggedInPosition === "officer" && (
                                            <td className={stylesDB.dataCell}>
                                                <div className={stylesDB.actionButtons}>
                                                {editingRow === m._id ? (
                                                    <>
                                                    <button
                                                        onClick={() => handleEditSave(m._id)}
                                                        className={stylesDB.saveButton}
                                                    >
                                                        <CheckIcon />
                                                    </button>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        className={stylesDB.cancelButton}
                                                    >
                                                        <Cross2Icon />
                                                    </button>
                                                    </>
                                                ) : (
                                                    <>
                                                    <button onClick={() => handleEditStart(m)} className={stylesDB.editButton}>
                                                         <Pencil2Icon />
                                                    </button>
                                                    <button onClick={() => handleDeleteMember(m.idNum)} className={stylesDB.editButton}>
                                                        <TrashIcon />
                                                    </button>
                                                    </>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={stylesDB.bottomControls}>
                        <button className={stylesDB.generateReportBtn}>
                            Add Member
                        </button>
                        <span> </span>
                        <button className={stylesDB.generateReportBtn}>
                            Generate Report
                        </button>
                    </div>
            </div>
            </div>
        </motion.div>
    );
}

export default MemberDBPage;
