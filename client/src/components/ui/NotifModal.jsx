import * as React from "react";
import { ArrowRightIcon, ColorWheelIcon } from '@radix-ui/react-icons';
import { AlertDialog } from "radix-ui";
import { Link } from "react-router-dom";
import styles from "./NotifModal.module.css";

const NotifModal = () => (
	<AlertDialog.Root className={styles.Root}>
		<AlertDialog.Trigger asChild>
			{/* Use className={`${importName.moduleClass} globalClass`} if combining multiple css classes */}
			<button className={`${styles.Button} dialogBtn`}>Sample Modal</button>
		</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay className={styles.Overlay} />
			<AlertDialog.Content className={styles.Content}>
				<div style={{display: "flex"}}>
					{/* Use className={importName.moduleClass} if only using a single class */}
					<Link to="/game-details" className={styles.LinkGameDetails}>See full game details &gt;&gt;</Link>
				</div>
				<header className={styles.ModalHeader}>
					<AlertDialog.Title className={styles.Title}>
						<h2>Game Time Changed</h2>
					</AlertDialog.Title>
					<AlertDialog.Description className={styles.Description}>
					{/* Replace with variables and fix styling, also can't adjust font-weight?? */}
						<h1 style={{color: "gray"}}>16:30 </h1>
						<ArrowRightIcon width={30} height={30} className={styles.RightArrow} />
						<h1 className={styles.NewTime}> 17:00</h1>
						<sub>March 21 | 17:00 | Razon</sub>
					</AlertDialog.Description>
				</header>
				<AlertDialog.Description width={40} height={40}className={styles.Description}>
					<p>Would you like to proceed?</p>
				</AlertDialog.Description>
				<div style={{ display: "flex", gap: 25, justifyContent: "space-evenly" }}>
					<AlertDialog.Cancel asChild>
						<button className={`${styles.Button} confirm`}>Yes</button>
					</AlertDialog.Cancel>
					<AlertDialog.Action asChild>
						<button className={`${styles.Button} cancel`}>
							No, I'll backout
						</button>
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
);

export default NotifModal;
