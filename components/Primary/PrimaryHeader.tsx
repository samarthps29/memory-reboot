import { SetStateAction, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import HeaderButtons from "../Common/HeaderButtons";
import SearchBar from "../Common/SearchBar";
// import { View } from "../Common/Themed";

const PrimaryHeader = ({
	searchTerm,
	setSearchTerm,
	selectedHeaderButton,
	setSelectedHeaderButton,
}: {
	searchTerm: string;
	setSearchTerm: React.Dispatch<SetStateAction<string>>;
	selectedHeaderButton: string;
	setSelectedHeaderButton: React.Dispatch<SetStateAction<string>>;
}) => {
	const storageContext = useContext(StorageContext);
	return (
		<View style={styles.container}>
			<HeaderButtons
				optionsArr={storageContext?.playlistData || []}
				selectedHeaderButton={selectedHeaderButton}
				setSelectedHeaderButton={setSelectedHeaderButton}
				source="primary"
			/>
			<SearchBar
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				handleSearch={() => {}}
				source="primary"
			/>
		</View>
	);
};

export default PrimaryHeader;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		backgroundColor: "transparent",
	},
});
