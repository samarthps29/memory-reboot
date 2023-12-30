import { SetStateAction, createContext, useEffect, useState } from "react";

export const FloatingContext = createContext<{
	floatDialogToggle: boolean;
	setFloatDialogToggle: React.Dispatch<React.SetStateAction<boolean>>;
	// floatMenuToggle: boolean;
	// setFloatMenuToggle: React.Dispatch<React.SetStateAction<boolean>>;
	floatInfo: {
		title: string;
		placeholder: string;
		btnText: string;
		handleButtonClick: (str: string) => void;
	} | null;
	setFloatInfo: React.Dispatch<
		SetStateAction<{
			title: string;
			placeholder: string;
			btnText: string;
			handleButtonClick: (str: string) => void;
		} | null>
	>;
} | null>(null);

export const FloatingContextProvider = ({
	children,
}: React.PropsWithChildren) => {
	const [floatDialogToggle, setFloatDialogToggle] = useState(false);
	const [floatMenuToggle, setFloatMenuToggle] = useState(false);
	const [floatInfo, setFloatInfo] = useState<{
		title: string;
		placeholder: string;
		btnText: string;
		handleButtonClick: (str: string) => void;
	} | null>(null);

	return (
		<FloatingContext.Provider
			value={{
				floatDialogToggle,
				// floatMenuToggle,
				setFloatDialogToggle,
				// setFloatMenuToggle,
				floatInfo,
				setFloatInfo,
			}}
		>
			{children}
		</FloatingContext.Provider>
	);
};
