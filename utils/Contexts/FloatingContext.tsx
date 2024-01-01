import { SetStateAction, createContext, useState } from "react";
import { floatingDialogType } from "../TypeDeclarations";

export const FloatingContext = createContext<{
	floatDialogToggle: boolean;
	setFloatDialogToggle: React.Dispatch<React.SetStateAction<boolean>>;
	floatInfo: floatingDialogType | null;
	setFloatInfo: React.Dispatch<SetStateAction<floatingDialogType | null>>;
} | null>(null);

export const FloatingContextProvider = ({
	children,
}: React.PropsWithChildren) => {
	const [floatDialogToggle, setFloatDialogToggle] = useState(false);
	const [floatInfo, setFloatInfo] = useState<floatingDialogType | null>(null);

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
