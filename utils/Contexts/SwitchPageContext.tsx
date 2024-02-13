import { createContext, useState } from "react";

export const SwitchPageContext = createContext<{
	showHeader: boolean;
	setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const SwitchPageContextProvider = ({
	children,
}: React.PropsWithChildren) => {
	const [showHeader, setShowHeader] = useState(false);

	return (
		<SwitchPageContext.Provider value={{ showHeader, setShowHeader }}>
			{children}
		</SwitchPageContext.Provider>
	);
};
