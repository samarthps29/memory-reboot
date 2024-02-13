import { useContext, useState } from "react";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";
import PrimaryHeader from "./PrimaryHeader";
import SongList from "./SongList";

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
