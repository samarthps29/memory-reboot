import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { StorageContext } from "../../utils/Contexts/StorageContext";
// import { View } from "./Themed";

const SearchBar = ({
	searchTerm,
	setSearchTerm,
	handleSearch,
	source,
}: {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	source: string;
	handleSearch: () => void;
}) => {
	const storageContext = useContext(StorageContext);
	return (
		<View style={styles.searchContainer}>
			<TextInput
				editable={
					source === "primary" ||
					(source === "secondary" && storageContext?.apiKey !== null)
				}
				spellCheck={false}
				placeholder="Search for your song"
				selectionColor={COLORS.gray}
				style={styles.searchBar}
				value={searchTerm}
				onChangeText={(text) => setSearchTerm(text)}
				onSubmitEditing={handleSearch}
				returnKeyType="search"
				placeholderTextColor={COLORS.gray}
			/>
		</View>
	);
};

export default SearchBar;

const styles = StyleSheet.create({
	searchContainer: {
		width: "100%",
		marginTop: SIZES.medium,
		borderRadius: SIZES.medium,
		overflow: "hidden",
	},
	searchBar: {
		backgroundColor: COLORS.darkSecondary,
		color: "white",
		fontFamily: FONT.medium,
		fontSize: SIZES.medium,
		padding: SIZES.medium,
	},
});
