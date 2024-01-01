import { SetStateAction, useContext } from "react";
import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import HeaderButtons from "../Common/HeaderButtons";
import SearchBar from "../Common/SearchBar";
import { View } from "../Common/Themed";

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
	buttonContainer: {
		borderRadius: SIZES.xLarge,
		// backgroundColor: COLORS.whiteSecondary,
		alignItems: "center",
		justifyContent: "center",
		padding: SIZES.xSmall,
	},
	buttonText: {
		fontFamily: FONT.medium,
		fontSize: 14,
	},
	searchContainer: {
		width: "100%",
		marginTop: SIZES.medium,
		borderRadius: SIZES.medium,
		overflow: "hidden",
	},
	searchBar: {
		fontFamily: FONT.medium,
		fontSize: SIZES.medium,
		padding: SIZES.medium,
		backgroundColor: COLORS.whiteSecondary,
	},
});
