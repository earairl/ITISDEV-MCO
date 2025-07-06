import * as React from "react";
import { AlertDialog } from "radix-ui";
import styles from "./AlertModal.module.css";

const AlertModal = ({ open, onOpenChange, title, description, onConfirm, onCancel}) => (
	// open tells Radix whether the dialog should be open.
	// onOpenChange is a callback Radix calls when it wants to request a change in the open state
	<AlertDialog.Root open={open} onOpenChange={onOpenChange} className={styles.Root}>
		{/* <AlertDialog.Trigger asChild>
			<button className={`${styles.Button} trigger`}>Delete account</button>
		</AlertDialog.Trigger> */}
		<AlertDialog.Portal>
			<AlertDialog.Overlay className={styles.Overlay} />
			<AlertDialog.Content className={styles.Content}>
				<AlertDialog.Title className={styles.Title}>
					{ title }
				</AlertDialog.Title>
				<AlertDialog.Description className={styles.Description}>
					{description}
				</AlertDialog.Description>
				<div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
					<AlertDialog.Cancel asChild>
						<button className={`${styles.Button} cancel`} onClick={onCancel}>Cancel</button>
					</AlertDialog.Cancel>
					<AlertDialog.Action asChild>
						<button className={`${styles.Button} confirm`} onClick={onConfirm}>
							Yes
						</button>
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
);

export default AlertModal;
