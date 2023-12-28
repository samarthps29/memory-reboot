import { SetStateAction, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../constants/theme";
import SearchBar from "./SearchBar";
import { Text, View } from "./Themed";
import HeaderButtons from "./HeaderButtons";

const playlists = ["all", "sam", "mreboot"];

const PrimaryHeader = ({
	searchTerm,
	setSearchTerm,
}: {
	searchTerm: string;
	setSearchTerm: React.Dispatch<SetStateAction<string>>;
}) => {
	// const [selectedOption, setSelectedOption] = useState(0);
	return (
		<View style={styles.container}>
			<HeaderButtons optionsArr={playlists} />
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
		// backgroundColor: COLORS.white,
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
		backgroundColor: COLORS.white,
	},
});
