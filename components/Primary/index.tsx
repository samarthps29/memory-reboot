import { useState } from "react";
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
	return (
		<>
			<PrimaryHeader
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				selectedHeaderButton={selectedHeaderButton}
				setSelectedHeaderButton={setSelectedHeaderButton}
			/>
			<SongList
				searchTerm={searchTerm}
				selectedHeaderButton={selectedHeaderButton}
			/>
		</>
	);
};

export default PrimaryScreen;
