import { createContext, useState } from "react";

export const SwitchPageContext = createContext<{
	switchPage: boolean;
	setSwitchPage: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const SwitchPageContextProvider = ({
	children,
}: React.PropsWithChildren) => {
	const [switchPage, setSwitchPage] = useState(false);

	return (
		<SwitchPageContext.Provider value={{ switchPage, setSwitchPage }}>
			{children}
		</SwitchPageContext.Provider>
	);
};
