import { SetStateAction, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { getYTdata } from "../../utils/api/ytdata";
import { videoItemType } from "../../utils/TypeDeclarations";
import HeaderButtons from "../Common/HeaderButtons";
import SearchBar from "../Common/SearchBar";
import { View } from "../Common/Themed";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";
import { StorageContext } from "../../utils/Contexts/StorageContext";

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
	const switchContext = useContext(SwitchPageContext);
	const storageContext = useContext(StorageContext);

	const handleSearch = () => {
		setIsLoading(true);
		getYTdata(searchTerm, storageContext?.apiKey || "")
			.then((res) => {
				setVideoData(res.data.items);
			})
			.catch((err) => {
				console.log("Error in api call", err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	return (
		<View style={styles.container}>
			{switchContext?.showHeader && (
				<HeaderButtons
					optionsArr={options}
					selectedHeaderButton={selectedHeaderButton}
					setSelectedHeaderButton={setSelectedHeaderButton}
					source="secondary"
				/>
			)}
			<SearchBar
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				handleSearch={handleSearch}
				source="secondary"
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
