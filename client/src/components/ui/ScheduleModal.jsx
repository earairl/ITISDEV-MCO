import { useState } from "react";
import FormModal from "@/components/ui/FormModal";
import { useToast } from "@/components/ui/Toaster";

const ScheduleModal = ({ userId, onSuccess, style }) => {
    const [form, setForm] = useState({
        date: "", start: "", end: "", venue: "", maxPlayers: "", allowOutsiders: false
    });
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
        const res = await fetch("http://localhost:5000/createMatch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ ...form, userId }),
        });
        const data = await res.json();
        showToast({ description: data.message, duration: 2000 });
        if (res.ok) {
            setOpen(false);
            setForm({ date: "", start: "", end: "", venue: "", maxPlayers: "", allowOutsiders: false });
            onSuccess?.();
        }
        } catch (err) {
        showToast({ title: "Create Match Error", description: err.message });
        } finally {
        setSubmitting(false);
        }
    };

    return (
        <>
        <input
            type="button"
            value="Schedule New Game"
            onClick={() => setOpen(true)}
            className={style}
        />
        <FormModal
            open={open}
            onOpenChange={setOpen}
            title="Schedule Game"
            description="Complete the form to create a new queuing schedule."
            onConfirm={handleSubmit}
            onCancel={() => setForm({ date: "", start: "", end: "", venue: "", maxPlayers: "", allowOutsiders: false })}
            submitting={submitting}
        >
            <FormModal.Row columns={4}>
                <label>Date:
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
                </label>
                <label>Start Time:
                <input type="time" name="start" value={form.start} onChange={handleChange} required />
                </label>
                <label>End Time:
                <input type="time" name="end" value={form.end} onChange={handleChange} required />
                </label>
                <label>Max Players:
                <input type="number" name="maxPlayers" value={form.maxPlayers} onChange={handleChange} required />
                </label>
            </FormModal.Row>

            <FormModal.Row variant="3fr1fr">
                <label>Venue:
                <input type="text" name="venue" value={form.venue} onChange={handleChange} required />
                </label>
            </FormModal.Row>

            <FormModal.Checkbox
                name="allowOutsiders"
                label="Allow outsiders"
                checked={form.allowOutsiders}
                onChange={handleChange}
            />
        </FormModal>
        </>
    );
};

export default ScheduleModal;