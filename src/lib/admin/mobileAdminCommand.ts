import { createContext } from 'svelte';

type MobileAdminCommand = {
	openMenu: () => void;
};

export const [getMobileAdminCommand, setMobileAdminCommand] = createContext<MobileAdminCommand>();
