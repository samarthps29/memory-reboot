import axios from "axios";

export const getYTdata = (query: string) => {
	return axios.get(
		`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query}&key=AIzaSyDhuCpRbX7ZajL10pK-npS5cATrmH-tC6g&fields=items(id,snippet(title,channelTitle,publishedAt,thumbnails))&type=video`,
		{ responseType: "json" }
	);
};

// use res.data.items as the data arr
// TODO: VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 9010.9091796875, "dt": 581, "prevDt": 683}
