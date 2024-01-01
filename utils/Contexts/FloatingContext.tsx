import { SetStateAction, createContext, useState } from "react";

export const FloatingContext = createContext<{
	floatDialogToggle: boolean;
	setFloatDialogToggle: React.Dispatch<React.SetStateAction<boolean>>;
	floatInfo: {
		title: string;
		placeholder: string;
		btnText: string;
		btnSecondaryText?: string;
		handleButtonClick: (str: string) => void;
		handleSecondaryButtonClick?: () => void;
	} | null;
	setFloatInfo: React.Dispatch<
		SetStateAction<{
			title: string;
			placeholder: string;
			btnText: string;
			btnSecondaryText?: string;
			handleButtonClick: (str: string) => void;
			handleSecondaryButtonClick?: () => void;
		} | null>
	>;
} | null>(null);

export const FloatingContextProvider = ({
	children,
}: React.PropsWithChildren) => {
	const [floatDialogToggle, setFloatDialogToggle] = useState(false);
	const [floatInfo, setFloatInfo] = useState<{
		title: string;
		placeholder: string;
		btnText: string;
		btnSecondaryText?: string;
		handleButtonClick: (str: string) => void;
		handleSecondaryButtonClick?: () => void;
	} | null>(null);

	return (
		<FloatingContext.Provider
			value={{
				floatDialogToggle,
				setFloatDialogToggle,
				floatInfo,
				setFloatInfo,
			}}
		>
			{children}
		</FloatingContext.Provider>
	);
};
