import * as React from "react";
import { ScrollArea } from "radix-ui";
import styles from "./ScrollableArea.module.css";

// sample data
const TAGS = Array.from({ length: 50 }).map(
	(_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

// add conditionals to determine what to render, e.g. data for games, times, notifs, etc.
const ScrollableArea = ({ tabName }) => (
	<>
		<h2 className={styles.TabTitle}>{ tabName }</h2>
		<ScrollArea.Root className={styles.Root}>
			<ScrollArea.Viewport className={styles.Viewport}>
				<div style={{ padding: "15px 20px" }}>
					{/* <div className={styles.Text}>Scrollable Area</div> */}
					{TAGS.map((tag) => (
						// might use a custom component to display info
						<div className={styles.Tag} key={tag}>
							{tag}
						</div>
					))}
				</div>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar className={styles.Scrollbar} orientation="vertical">
				<ScrollArea.Thumb className={styles.Thumb} />
			</ScrollArea.Scrollbar>
			<ScrollArea.Scrollbar className={styles.Scrollbar} orientation="horizontal">
				<ScrollArea.Thumb className={styles.Thumb} />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner className={styles.Corner} />
		</ScrollArea.Root>
	</>
);

export default ScrollableArea;
