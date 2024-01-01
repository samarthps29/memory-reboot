import { StyleSheet, useColorScheme } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { View } from "./Themed";
import { useContext } from "react";
import { StorageContext } from "../../utils/Contexts/StorageContext";

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
	const colorScheme = useColorScheme();
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
				style={[
					styles.searchBar,
					{
						backgroundColor:
							colorScheme === "light"
								? COLORS.whiteSecondary
								: COLORS.darkSecondary,
						color: colorScheme === "light" ? "black" : "white",
					},
				]}
				value={searchTerm}
				onChangeText={(text) => setSearchTerm(text)}
				onSubmitEditing={handleSearch}
				returnKeyType="search"
				placeholderTextColor={
					colorScheme === "light" ? COLORS.darkTertiary : COLORS.gray
				}
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
		fontFamily: FONT.medium,
		fontSize: SIZES.medium,
		padding: SIZES.medium,
	},
});
