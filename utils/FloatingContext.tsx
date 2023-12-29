import { SetStateAction, createContext, useEffect, useState } from "react";

export const FloatingContext = createContext<{
	floatToggle: boolean;
	setFloatToggle: React.Dispatch<React.SetStateAction<boolean>>;
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
	const [floatToggle, setFloatToggle] = useState(false);
	const [floatInfo, setFloatInfo] = useState<{
		title: string;
		placeholder: string;
		btnText: string;
		handleButtonClick: (str: string) => void;
	} | null>(null);

	return (
		<FloatingContext.Provider
			value={{ floatToggle, setFloatToggle, floatInfo, setFloatInfo }}
		>
			{children}
		</FloatingContext.Provider>
	);
};
