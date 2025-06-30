import * as React from "react";
import { Avatar } from "radix-ui";
import styles from "./UserAvatar.module.css";

const UserAvatar = ({ userImg, initials}) => (
	<div style={{ display: "flex", gap: 20 }}>
		<Avatar.Root className={styles.Root}>
			<Avatar.Image
				className={styles.Image}
				src={userImg}
				alt="User-Avatar"
			/>
			<Avatar.Fallback className={styles.Fallback} delayMs={600}>
				{initials}
			</Avatar.Fallback>
		</Avatar.Root>
	</div>
);

export default UserAvatar;
