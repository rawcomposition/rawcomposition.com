import * as React from "react";

function Lightbox({data: {imageId, caption}, handleClose}) {
	const [isLoading, setIsLoading] = React.useState(true);
	React.useEffect(() => {
		const handleKeyUp = (e) => {
			const {keyCode} = e;
			if(keyCode === 27) { //Escape key
				handleClose();
			}
		}
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keyup", handleKeyUp);
		}
	}, [handleClose]);

	React.useEffect(() => {
		setIsLoading(true);
		if(imageId) {
			const img = new Image();
			img.src = `https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${imageId}/2400`;
			img.onload = () => {
				setIsLoading(false);
			}
		}
	}, [imageId]);
	
	if(!imageId) {
		return "";
	}

	return (
		<div className="fixed w-full h-full left-0 top-0 flex items-center justify-center p-3 bg-black/80 text-white">
			{(imageId && !isLoading) ?
				<figure>
					<img src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${imageId}/2400`} className="h-full max-h-[calc(100vh-90px)] max-w-full" />
					<figcaption>{caption}</figcaption>
				</figure>
			: <div className="loader">Loading...</div>}
			<button className="absolute top-2 right-6 outline-none text-[2.5rem] font-bold" onClick={handleClose}>&times;</button>
		</div>
	)
}

export default Lightbox;