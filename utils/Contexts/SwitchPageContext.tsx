import { createContext, useState } from "react";

export const SwitchPageContext = createContext<{
	switchPage: boolean;
	showHeader: boolean;
	setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
	setSwitchPage: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const SwitchPageContextProvider = ({
	children,
}: React.PropsWithChildren) => {
	const [switchPage, setSwitchPage] = useState(false);
	const [showHeader, setShowHeader] = useState(false);

	return (
		<SwitchPageContext.Provider
			value={{ switchPage, setSwitchPage, showHeader, setShowHeader }}
		>
			{children}
		</SwitchPageContext.Provider>
	);
};
