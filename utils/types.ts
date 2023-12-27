import { ImageProps } from "react-native";
export type thumbnailItemType = {
	url: string;
	height: number;
	width: number;
};

export type songItemType = {
	sid: string;
	sname: string;
	aname: string;
	duration: string;
	thumbnail: ImageProps;
};

export type videoItemType = {
	id: { kind: string; videoId: string };
	snippet: {
		publishedAt: string;
		title: string;
		channelTitle: string;
		thumbnails: {
			default: thumbnailItemType;
			medium: thumbnailItemType;
			high: thumbnailItemType;
		};
	};
};
