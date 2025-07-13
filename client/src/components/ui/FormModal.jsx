import * as Dialog from "@radix-ui/react-dialog";
import styles from "./FormModal.module.css";

const FormModal = ({
    open,
    onOpenChange,
    title = "Form Modal",
    description = null,
    children,
    onConfirm,
    onCancel,
    confirmLabel = "Submit",
    cancelLabel = "Cancel",
    submitting = false,
}) => {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.Overlay} />
                <Dialog.Content className={styles.Content}>
                    <div className={styles.ModalHeader}>
                        <Dialog.Title className={styles.Title}>{title}</Dialog.Title>
                    </div>

                    {description && (
                        <Dialog.Description className={styles.Description}>
                            {description}
                        </Dialog.Description>
                    )}

                    <form
                        className={styles.FormContent}
                        onSubmit={(e) => {
                            e.preventDefault();
                            onConfirm?.();
                        }}
                    >
                        {children}

                        <div style={{ display: "flex", justifyContent: "space-evenly", gap: "10px", marginTop: "1.5rem" }}>
                            <Dialog.Close asChild>
                                <button 
                                    type="button" 
                                    className={`${styles.Button} cancel`}
                                    onClick={onCancel}
                                >
                                    {cancelLabel}
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                className={`${styles.Button} confirm`}
                                disabled={submitting}
                            >
                                {submitting ? "Submitting..." : confirmLabel}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default FormModal;