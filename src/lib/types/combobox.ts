// src/lib/types/combobox.ts
export interface ComboBoxSelectableOption {
	text: string;
	value?: string;
	disabled?: boolean;
	displayText?: string;
	[key: string]: unknown;
}

export interface ComboBoxOption extends ComboBoxSelectableOption {
	options?: ComboBoxSelectableOption[];
}

export interface ComboBoxGroupOption extends ComboBoxOption {
	options: ComboBoxSelectableOption[];
}

export type ComboBoxFilter = (text: string) => ComboBoxOption[] | Promise<ComboBoxOption[]>;
