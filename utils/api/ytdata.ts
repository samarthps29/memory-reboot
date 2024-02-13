import axios from "axios";

export const getYTdata = (query: string, key: string) => {
	return axios.get(
		`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query}&key=${key}&fields=items(id,snippet(title,channelTitle,publishedAt,thumbnails))&type=video`,
		{ responseType: "json" }
	);
};
