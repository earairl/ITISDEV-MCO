import * as React from "react";
import { Switch } from "radix-ui";
import styles from "./ToggleSwitch.module.css";

const ToggleSwitch = ({ btnLabel, btnName }) => (
	<form>
		<div style={{ display: "flex", alignItems: "center" }}>
			<label
				className={styles.Label}
				htmlFor={btnLabel}
				style={{ paddingRight: 15 }}
			>
				{btnName}
			</label>
			<Switch.Root className={styles.Root} id={btnLabel}>
				<Switch.Thumb className={styles.Thumb} />
			</Switch.Root>
		</div>
	</form>
);

export default ToggleSwitch;
