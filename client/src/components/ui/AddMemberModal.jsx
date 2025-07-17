import { useState } from "react";
import FormModal from "@/components/ui/FormModal";
import { useToast } from "@/components/ui/Toaster";

const initialForm = {
    idNum: "", firstName: "", lastName: "", contactNo: "",
    email: "", fbLink: "", telegram: "", college: "BAGCED",
    position: "member", dateJoined: ""
};

const colleges = ["BAGCED", "CCS", "CLA", "COS", "GCOE", "RVRCOB", "SOE", "TDSOL"];

const AddMemberModal = ({ onSuccess, btnStyle }) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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
        showToast({ description: data.message || "Member created.", duration: 2000 });
        if (response.ok) {
            setOpen(false);
            resetForm();
            onSuccess?.();
        }
        } catch (err) {
        showToast({ title: "Error", description: err.message });
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
            <FormModal.Row columns={4}>
            {["idNum", "firstName", "lastName", "contactNo"].map(field => (
                <label>{field}:
                    <input type="text" name={field} value={form[field]} onChange={handleChange} required />
                </label>
            ))}
            </FormModal.Row>

            <FormModal.Row columns={3}>
                <label>Email:
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </label>
                <label>Facebook Link:
                <input type="url" name="fbLink" value={form.fbLink} onChange={handleChange} />
                </label>
                <label>Telegram:
                <input type="text" name="telegram" value={form.telegram} onChange={handleChange} />
                </label>
            </FormModal.Row>

            <FormModal.Row columns={3}>
                <label>College:
                <select name="college" value={form.college} onChange={handleChange}>
                    {colleges.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                </label>
                <label>Position:
                <select name="position" value={form.position} onChange={handleChange}>
                    <option value="member">Member</option>
                    <option value="officer">Officer</option>
                </select>
                </label>
                <label>Date Joined:
                <input type="date" name="dateJoined" value={form.dateJoined} onChange={handleChange} />
                </label>
            </FormModal.Row>
        </FormModal>
        </>
    );
};

export default AddMemberModal;