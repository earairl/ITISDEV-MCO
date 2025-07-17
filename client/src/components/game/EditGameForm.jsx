import FormModal from "@/components/ui/FormModal";
import { useState } from "react";
import { useToast } from '@/components/ui/Toaster';

const EditGameForm = ({ userId, game, onSuccess }) => {
    function to24Hour(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
        else if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    const newDate = new Date(game.date).toISOString().split('T')[0]
    const newStart = to24Hour(game.start)
    const newEnd = to24Hour(game.end)

    const [form, setForm] = useState({ date: newDate, start: newStart, end: newEnd, venue: game.venue, maxPlayers: game.maxPlayers, allowOutsiders: game.allowOutsiders });
    const [submitting, setSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await fetch("http://localhost:5000/editMatch", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ ...form, gameId: game._id, userId })
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
            console.error('Edit match error:', err);
            showToast({
                title: 'Edit Match Error',
                description: err.message || 'An unknown error occurred.'
            });
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({ date: newDate, start: newStart, end: newEnd, venue: game.venue, maxPlayers: game.maxPlayers, allowOutsiders: game.allowOutsiders });
    };

    return (
        <>
            <span 
                className="material-symbols-outlined"
                onClick={() => setOpen(true)}
            >
                edit_square
            </span>

            <FormModal
                open={open}
                onOpenChange={setOpen}
                title="Edit Game"
                description="Complete the form to edit the current queueing schedule."
                onConfirm={handleSubmit}
                onCancel={resetForm}
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

export default EditGameForm;