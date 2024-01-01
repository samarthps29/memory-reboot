import { useState } from "react";
import { defaultVideoData } from "../../constants/VideoData";
import { videoItemType } from "../../utils/TypeDeclarations";
import SecondaryHeader from "./SecondaryHeader";
import VideoList from "./VideoList";

const SecondaryScreen = ({
	selectedHeaderButton,
	setSelectedHeaderButton,
}: {
	selectedHeaderButton: string;
	setSelectedHeaderButton: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const [videoData, setVideoData] =
		useState<videoItemType[]>(defaultVideoData);
	const [isLoading, setIsLoading] = useState(false);

	return (
		<>
			<SecondaryHeader
				setVideoData={setVideoData}
				selectedHeaderButton={selectedHeaderButton}
				setSelectedHeaderButton={setSelectedHeaderButton}
				setIsLoading={setIsLoading}
			/>
			<VideoList videoData={videoData} isLoading={isLoading} />
		</>
	);
};

export default SecondaryScreen;
