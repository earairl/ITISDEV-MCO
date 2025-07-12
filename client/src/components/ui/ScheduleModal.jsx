import FormModal from "@/components/ui/FormModal";
import { useState } from "react";

const ScheduleModal = ({ userId, onSuccess }) => {
    const [form, setForm] = useState({ date: "", time: "", venue: "", maxPlayers: "" });
    const [conflict, setConflict] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setConflict(null);
    };

    const handleSubmit = () => {
        setSubmitting(true);
        
        setSubmitting(false);
    };

    return (
        <>
        <input
            type="button"
            value="Create New Schedule"
            onClick={() => setOpen(true)}
        />

        <FormModal
            open={open}
            onOpenChange={setOpen}
            title="Schedule Game"
            onConfirm={handleSubmit}
            submitting={submitting}
        >
            <label>Date:
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </label>
            <label>Time:
            <input type="time" name="time" value={form.time} onChange={handleChange} required />
            </label>
            <label>Venue:
            <input type="text" name="venue" value={form.venue} onChange={handleChange} required />
            </label>
            <label>Max Players:
            <input type="number" name="maxPlayers" value={form.maxPlayers} onChange={handleChange} required />
            </label>
            {conflict && (
            <p style={{ color: "red", marginTop: "1rem" }}>
                Conflict: Game already scheduled at {conflict.venue} on {new Date(conflict.date).toLocaleString()}
            </p>
            )}
        </FormModal>
        </>
    );
};

export default ScheduleModal;