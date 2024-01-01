import { SetStateAction, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { getYTdata } from "../utils/api/ytdata";
import { videoItemType } from "../utils/TypeDeclarations";
import HeaderButtons from "./HeaderButtons";
import SearchBar from "./SearchBar";
import { View } from "./Themed";

const options = [
	{ pid: "0", pname: "Search" },
	{ pid: "1", pname: "import from youtube" },
	{ pid: "2", pname: "import from spotify" },
];

const SecondaryHeader = ({
	setVideoData,
	selectedHeaderButton,
	setSelectedHeaderButton,
	setIsLoading,
}: {
	setVideoData: React.Dispatch<React.SetStateAction<videoItemType[]>>;
	selectedHeaderButton: string;
	setSelectedHeaderButton: React.Dispatch<SetStateAction<string>>;
	setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = () => {
		setIsLoading(true);
		getYTdata(searchTerm)
			.then((res) => {
				setVideoData(res.data.items);
			})
			.catch(() => {
				console.log("error");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	return (
		<View style={styles.container}>
			<HeaderButtons
				optionsArr={options}
				selectedHeaderButton={selectedHeaderButton}
				setSelectedHeaderButton={setSelectedHeaderButton}
				source="secondary"
			/>
			<SearchBar
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				handleSearch={handleSearch}
			/>
		</View>
	);
};

export default SecondaryHeader;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		backgroundColor: "transparent",
	},
});
