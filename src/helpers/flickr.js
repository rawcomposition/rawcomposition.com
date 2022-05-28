export async function getPhotos(page = 1) {
	const api_key = import.meta.env.PUBLIC_FLICKR_API;
	const per_page = 15;
	const url = `https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${api_key}&user_id=rawcomposition&per_page=${per_page}&page=${page}&format=json&extras=description,o_dims&nojsoncallback=1`;
	const response = await fetch(url);
	const data = await response.json();
	return data.photos;
}