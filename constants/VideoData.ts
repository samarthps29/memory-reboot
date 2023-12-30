import { videoItemType } from "../utils/types";

export const defaultVideoData: videoItemType[] = [
	{
		id: {
			kind: "youtube#video",
			videoId: "wL8DVHuWI7Y",
		},
		snippet: {
			publishedAt: "2023-01-17T12:15:03Z",
			title: "VØJ, Narvent - Memory Reboot (4K Music Video)",
			thumbnails: {
				default: {
					url: "https://i.ytimg.com/vi/wL8DVHuWI7Y/default.jpg",
					width: 120,
					height: 90,
				},
				medium: {
					url: "https://i.ytimg.com/vi/wL8DVHuWI7Y/mqdefault.jpg",
					width: 320,
					height: 180,
				},
				high: {
					url: "https://i.ytimg.com/vi/wL8DVHuWI7Y/hqdefault.jpg",
					width: 480,
					height: 360,
				},
			},
			channelTitle: "Narvent",
		},
	},
];
