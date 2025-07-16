import FormModal from "@/components/ui/FormModal";
import { useState } from "react";
import { useToast } from '@/components/ui/Toaster';

const ScheduleModal = ({ userId, onSuccess }) => {
    const [form, setForm] = useState({ date: "", start: "", end: "", venue: "", maxPlayers: "", allowOutsiders: false });
    const [submitting, setSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();

    const handleChange = (e) => {
        // setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

        const { name, type, value, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await fetch("http://localhost:5000/createMatch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ ...form, userId })
            });
            
            const data = await response.json();
            showToast({
                description: data.message,
                duration: 2000,
            });
            if (response.ok) {
                setSubmitting(false);
                setOpen(false);
                onSuccess?.();
            } else {
                setSubmitting(false);
            }
        } catch (err) {
            console.error('Create match error:', err);
            showToast({
                title: 'Create Match Error',
                description: err.message || 'An unknown error occurred.'
            });
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({ date: "", start: "", end: "", venue: "", maxPlayers: "", allowOutsiders: false });
    };

    return (
        <>
        <input
            type="button"
            value="Schedule New Game"
            onClick={() => setOpen(true)}
        />

        <FormModal
            open={open}
            onOpenChange={setOpen}
            title="Schedule Game"
            description="Complete the form to create a new queuing schedule."
            onConfirm={handleSubmit}
            onCancel={resetForm}
            submitting={submitting}
        >
            <label>Date:
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </label>
            <label>Start Time:
            <input type="time" name="start" value={form.start} onChange={handleChange} required />
            </label>
            <label>End Time:
            <input type="time" name="end" value={form.end} onChange={handleChange} required />
            </label>
            <label>Venue:
            <input type="text" name="venue" value={form.venue} onChange={handleChange} required />
            </label>
            <label>Max Players:
            <input type="number" name="maxPlayers" value={form.maxPlayers} onChange={handleChange} required />
            </label>
            <label>
            <input type="checkbox" name="allowOutsiders" value={form.allowOutsiders} onChange={handleChange} />
                Allow outsiders
            </label>
        </FormModal>
        </>
    );
};

export default ScheduleModal;