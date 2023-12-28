import { useState } from "react";
import { StyleSheet } from "react-native";
import { getYTdata } from "../utils/api/ytdata";
import { videoItemType } from "../utils/types";
import HeaderButtons from "./HeaderButtons";
import SearchBar from "./SearchBar";
import { View } from "./Themed";

const options = ["import from youtube", "import from spotify"];

const SecondaryHeader = ({
	setVideoData,
}: {
	setVideoData: React.Dispatch<React.SetStateAction<videoItemType[]>>;
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const handleSearch = () => {
		getYTdata(searchTerm)
			.then((res) => {
				setVideoData(res.data.items);
			})
			.catch(() => console.log("error"));
		// setVideoData(VideoData);
	};
	return (
		<View style={styles.container}>
			<HeaderButtons optionsArr={options} />
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
