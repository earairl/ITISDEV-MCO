import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "./FormModal.module.css";

const FormModal = ({
    open,
    onOpenChange,
    title = "Form Modal",
    description = "",
    children,
    onConfirm,
    confirmLabel = "Submit",
    cancelLabel = "Cancel",
    submitting = false,
}) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
        <AlertDialog.Portal>
            <AlertDialog.Overlay className={styles.Overlay} />
            <AlertDialog.Content className={styles.Content}>
            <div className={styles.ModalHeader}>
                <AlertDialog.Title className={styles.Title}>{title}</AlertDialog.Title>
            </div>
            {description && (
                <div className={styles.Description}>
                <p>{description}</p>
                </div>
            )}

            <form className={styles.Description} onSubmit={(e) => e.preventDefault()}>
                {children}
            </form>

            <div style={{ display: "flex", justifyContent: "space-evenly", gap: "10px" }}>
                <AlertDialog.Cancel asChild>
                <button className={`${styles.Button} cancel`}>Cancel</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                <button
                    className={`${styles.Button} confirm`}
                    onClick={onConfirm}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : confirmLabel}
                </button>
                </AlertDialog.Action>
            </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};

export default FormModal;
