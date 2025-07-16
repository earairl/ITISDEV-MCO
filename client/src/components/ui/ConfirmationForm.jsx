import FormModal from "@/components/ui/FormModal";

export default function ConfirmationForm({ open, setOpen, action, object, onConfirm }) {
    const handleSubmit = async () => {
        await onConfirm()
    }

    const resetForm = () => {
        setOpen(false)
    }

    return (
        <>
        <FormModal
            open={open}
            onOpenChange={setOpen}
            title="Confirm Action"
            description={`Are you sure you want to ${action} the ${object}? You can't undo your changes.`}
            onConfirm={handleSubmit} // return true to GamePage
            onCancel={resetForm} // close the modal 
            submitting={false}
            confirmLabel = "Yes"
            cancelLabel = "No"
        />
        </>
    )
}