import MainLayout from "@/template/MainLayout";
import { CheckIcon, Cross2Icon, Pencil2Icon, MagnifyingGlassIcon, CalendarIcon, TrashIcon } from '@radix-ui/react-icons';
import FacebookIcon from '@/assets/facebook.png'
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";        
import styles from "./MemberDBPage.module.css";
import { useToast } from '@/components/ui/Toaster';   
import FilterMenu from "../components/ui/FilterMenu";
import { Link } from 'react-router-dom';
import AddMemberModal from "../components/ui/AddMemberModal";

function MemberDBPage() {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loggedInPosition, setLoggedInPosition] = useState("");
    const [editingRow, setEditingRow] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();
    const fileInputRef = useRef(null); 

    const fetchMembers = async () => {
        try {
            const res = await fetch("http://localhost:5000/getMembers");
            const data = await res.json();
            setMembers(data);
            setFilteredMembers(data);
        } catch (err) {
            console.error("Error fetching members:", err);
        }
    }

    useEffect(() => {
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

            // const saved = sessionStorage.getItem("user");
            // if (saved) {
            //     const updated = { ...JSON.parse(saved), dateJoined: editedData.dateJoined, email: editedData.email, position: editedData.position};
            //     sessionStorage.setItem("user", JSON.stringify(updated));
            // }
            
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

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:5000/importMembers", {
                method: "POST",
                body: formData,
            });

            const response = await res.json();

            if (res.ok) {
                showToast({
                    description: `${response.createdCount} member(s) imported successfully. ${response.skippedCount} skipped.`,
                    variant: "destructive"
                });
                fetchMembers?.();
            } else {
                showToast({
                    description: response.message || "Import failed",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error("Error importing members:", err);
            showToast({ description: "Upload failed", variant: "destructive" });
        }
    };

    const handleExportMembers = async () => {
        try {
            // const res = await fetch("http://localhost:5000/exportMembers");

            const res = await fetch("http://localhost:5000/exportMembers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ members: filteredMembers }),
            })

            if (!res.ok) {
                throw new Error("Failed to export members");
            }

            const blob = await res.blob(); // converts response to data type for file downloads
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `members_${new Date().toISOString().split('T')[0]}.xlsx`; 
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            showToast({ description: "Members exported successfully." });
        } catch (err) {
            console.error("Error exporting members:", err);
            showToast({ description: "Error exporting members", variant: "destructive" });
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
                        <div className={styles.headerControls}>
                            <div className={styles.searchBar}>
                                <MagnifyingGlassIcon className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                            <button className={styles.advancedFilterBtn} onClick={() => setShowFilter(!showFilter)}>
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
                    
                    <div className={styles.tableWrapper}>
                        <table className={styles.membersTable}>
                            <thead>
                                <tr className={styles.headerRow}>
                                    <th className={styles.headerCell}>ID Number</th>
                                    <th className={styles.headerCell}>First Name</th>
                                    <th className={styles.headerCell}>Last Name</th>
                                    <th className={styles.headerCell}>College</th>
                                    <th className={styles.headerCell}>Position</th>
                                    <th className={styles.headerCell}>Contact No</th>
                                    <th className={styles.headerCell}>Email</th>
                                    <th className={styles.headerCell}>Facebook</th>
                                    <th className={styles.headerCell}>Telegram</th>
                                    <th className={styles.headerCell}>Date Joined</th>
                                    <th className={styles.headerCell}>Last Match</th>
                                    <th className={styles.headerCell}>Status</th>
                                    {loggedInPosition === "officer" && (
                                        <th className={styles.headerCell}> </th> // space for the edit icon
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((m) => ( // loops through the filteredMembers array and generates a table row for each member
                                    <tr key={m._id} className={`${styles.dataRow} ${styles.hoverable}`} style={{ position: "relative" }}>
                                        
                                        <td className={styles.dataCell}>{m.idNum}</td>
                                        
                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? ( // is the current row (m._id) being edited?
                                                <input
                                                    type="text"
                                                    value={editedData.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                m.firstName
                                            )}
                                        </td>
                                        
                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                m.lastName
                                            )}
                                        </td>
                                        
                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <select
                                                    value={editedData.college}
                                                    onChange={(e) => handleInputChange('college', e.target.value)}
                                                    className={styles.editSelect}
                                                >
                                                    {colleges.map(college => (
                                                        <option key={college} value={college}>{college}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                m.college
                                            )}
                                        </td>
                                        
                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <select
                                                    value={editedData.position}
                                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                                    className={styles.editSelect}
                                                >
                                                    {positions.map(position => (
                                                        <option key={position} value={position}>{position}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                m.position
                                            )}
                                        </td>

                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.contactNo || ''}
                                                    onChange={(e) => handleInputChange('contactNo', e.target.value)}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                m.contactNo
                                            )}
                                        </td>

                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="email"
                                                    value={editedData.email || ''}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                m.email
                                            )}
                                        </td>

                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.fbLink || ''}
                                                    onChange={(e) => handleInputChange('fbLink', e.target.value)}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                <a href={m.fbLink} target="_blank" rel="noopener noreferrer" className={styles.fbContainer}>
                                                    <img src={FacebookIcon} className={styles.fbIcon}/>
                                                </a>
                                            )}
                                        </td>

                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.telegram || ''}
                                                    onChange={(e) => handleInputChange('telegram', e.target.value)}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                m.telegram || "-"
                                            )}
                                        </td>

                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="date"
                                                    value={editedData.dateJoined}
                                                    onChange={(e) => handleInputChange('dateJoined', e.target.value)}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                m.dateJoined ? new Date(m.dateJoined).toLocaleDateString() : ""
                                            )}
                                        </td>
                                        
                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <input
                                                    type="date"
                                                    value={editedData.lastMatchJoined}
                                                    onChange={(e) => handleInputChange('lastMatchJoined', e.target.value)}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                m.lastMatchJoined ? new Date(m.lastMatchJoined).toLocaleDateString() : "-"
                                            )}
                                        </td>
                                        
                                        <td className={styles.dataCell}>
                                            {editingRow === m._id ? (
                                                <select
                                                    value={editedData.isActive ? "Active" : "Inactive"}
                                                    onChange={(e) => handleInputChange('isActive', e.target.value === "Active")}
                                                    className={styles.editSelect}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            ) : (
                                                <span className={styles.statusWrapper}>
                                                    {m.isActive ? "Active" : "Inactive"}
                                                </span>
                                            )}
                                        </td>
                                        
                                        {loggedInPosition === "officer" && (
                                            <td className={styles.dataCell}>
                                                <div className={styles.actionButtons}>
                                                {editingRow === m._id ? (
                                                    <>
                                                    <button
                                                        onClick={() => handleEditSave(m._id)}
                                                        className={styles.saveButton}
                                                    >
                                                        <CheckIcon />
                                                    </button>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        className={styles.cancelButton}
                                                    >
                                                        <Cross2Icon />
                                                    </button>
                                                    </>
                                                ) : (
                                                    <>
                                                    <button onClick={() => handleEditStart(m)} className={styles.editButton}>
                                                         <Pencil2Icon />
                                                    </button>
                                                    <button onClick={() => handleDeleteMember(m.idNum)} className={styles.editButton}>
                                                        <TrashIcon />
                                                    </button>
                                                    </>
                                                    )}
                                                </div>
                                            </td>
                                        )}

                                        {m.username && editingRow !== m._id && (
                                        <td className={styles.overlayCell}>
                                        <Link
                                            to={`/profile/${m.username}`}
                                            className={styles.profileOverlay}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.bottomControls}>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleExcelUpload}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <button className={styles.generateReportBtn} 
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                                Import Members     
                        </button>
                        <div>
                            <AddMemberModal onSuccess={fetchMembers} btnStyle={styles.generateReportBtn}/>
                        </div>
                        <button className={styles.generateReportBtn} onClick={handleExportMembers}>
                            Export Members
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default MemberDBPage;
