import { useState } from "react";
import FormModal from "@/components/ui/FormModal";
import { useToast } from "@/components/ui/Toaster";
import styles from "./FormModal.module.css";

const initialForm = {
    idNum: "",
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    fbLink: "",
    telegram: "",
    college: "BAGCED",
    position: "member",
    dateJoined: "",
};

const AddMemberModal = ({ onSuccess, btnStyle }) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();
    const colleges = ["BAGCED", "CCS", "CLA", "COS", "GCOE", "RVRCOB", "SOE", "TDSOL"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setForm(initialForm);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await fetch("http://localhost:5000/addMember", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            const data = await response.json();

            showToast({
                description: data.message || "Member created.",
                duration: 2000,
            });

            if (response.ok) {
                setOpen(false);
                resetForm();
                onSuccess?.();
            }
        } catch (err) {
            showToast({
                title: "Error",
                description: err.message || "An error occurred",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className={btnStyle}>Add Member</button>
            <FormModal
                open={open}
                onOpenChange={setOpen}
                title="Add Member"
                description="Fill out the form to add a new member."
                onConfirm={handleSubmit}
                onCancel={resetForm}
                submitting={submitting}
            >
                <div className={`${styles.row} ${styles.fourColumns}`}>
                    <div className={styles.column}>
                        <label>ID Number:
                            <input type="text" name="idNum" value={form.idNum} onChange={handleChange} required />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>First Name:
                            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Last Name:
                            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Contact No:
                            <input type="text" name="contactNo" value={form.contactNo} onChange={handleChange} required />
                        </label>
                    </div>
                </div>

                <div className={`${styles.row} ${styles.threeColumns}`}>
                    <div className={styles.column}>
                        <label>Email:
                            <input type="email" name="email" value={form.email} onChange={handleChange} required />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Facebook Link:
                            <input type="url" name="fbLink" value={form.fbLink} onChange={handleChange} required />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Telegram:
                            <input type="text" name="telegram" value={form.telegram} onChange={handleChange} />
                        </label>
                    </div>
                </div>

                <div className={`${styles.row} ${styles.threeColumns}`}>
                    <div className={styles.column}>
                        <label>College:
                            <select name="college" value={form.college} onChange={handleChange} required>
                                {colleges.map(col => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Position:
                            <select name="position" value={form.position} onChange={handleChange}>
                                <option value="member">Member</option>
                                <option value="officer">Officer</option>
                            </select>
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Date Joined:
                            <input type="date" name="dateJoined" value={form.dateJoined} onChange={handleChange} />
                        </label>
                    </div>
                </div>

            </FormModal>
        </>
    );
};

export default AddMemberModal;