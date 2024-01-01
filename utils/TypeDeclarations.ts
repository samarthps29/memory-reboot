import dayjs from "dayjs";

export type thumbnailItemType = {
	url: string;
	height: number;
	width: number;
};

export type songItemType = {
	itemUri: string;
	sid: string;
	sname: string;
	aname: string;
	duration: string;
	thumbnail: string;
	downloaded: boolean;
	downloadedAt: dayjs.Dayjs;
	playlists: string[];
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

export type queueType = {
	queue: songItemType[];
	currentIndex: number;
};
