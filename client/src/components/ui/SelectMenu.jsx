import * as React from "react";
import { Select } from "radix-ui";
import classnames from "classnames";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons";
import styles from "./SelectMenu.module.css";

const SelectMenu = ({ position = "Position", onChange, value}) => (
	<Select.Root value={value} onValueChange={onChange}>
		<Select.Trigger className={styles.Trigger} aria-label="Position">
			<Select.Icon className={styles.Icon}>
				<ChevronDownIcon width={25} height={25} />
			</Select.Icon>
			<Select.Value placeholder={ position } />
		</Select.Trigger>
		<Select.Portal>
			<Select.Content className={styles.Content}>
				<Select.ScrollUpButton className={styles.ScrollButton}>
					<ChevronUpIcon />
				</Select.ScrollUpButton>
				<Select.Viewport className={styles.Viewport}>
					<Select.Group>
						<Select.Label className={styles.Label}>Assign Position</Select.Label>
						<Select.Separator className={styles.Separator} />
						{/* (if needed) Eventually update to take an array of items */}
						<SelectItem value="officer">Officer</SelectItem>
						<SelectItem value="member">Member</SelectItem>
					</Select.Group>
				</Select.Viewport>
				<Select.ScrollDownButton className={styles.ScrollButton}>
					<ChevronDownIcon />
				</Select.ScrollDownButton>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
);

const SelectItem = React.forwardRef(
	({ children, className, ...props }, forwardedRef) => {
		return (
			<Select.Item
				className={classnames(styles.Item, className)}
				{...props}
				ref={forwardedRef}
			>
				<Select.ItemText>{children}</Select.ItemText>
				<Select.ItemIndicator className={styles.ItemIndicator}>
					<CheckIcon />
				</Select.ItemIndicator>
			</Select.Item>
		);
	},
);

export default SelectMenu;
