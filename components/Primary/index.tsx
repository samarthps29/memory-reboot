import { useContext, useState } from "react";
import PrimaryHeader from "./PrimaryHeader";
import SongList from "./SongList";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";
import { View } from "react-native";
import { COLORS } from "../../constants/theme";

const PrimaryScreen = ({
	selectedHeaderButton,
	setSelectedHeaderButton,
}: {
	selectedHeaderButton: string;
	setSelectedHeaderButton: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const switchContext = useContext(SwitchPageContext);
	return (
		<>
			{switchContext?.showHeader && (
				<PrimaryHeader
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					selectedHeaderButton={selectedHeaderButton}
					setSelectedHeaderButton={setSelectedHeaderButton}
				/>
			)}
			<SongList
				searchTerm={searchTerm}
				selectedHeaderButton={selectedHeaderButton}
			/>
		</>
	);
};

export default PrimaryScreen;
