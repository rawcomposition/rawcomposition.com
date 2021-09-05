import { useEffect, useState } from "preact/hooks";
import Spinner from "./spinner.jsx";

function Lightbox({data: {imageId, caption}, handleClose}) {
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
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

	useEffect(() => {
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
		<div className="lightbox">
			{(imageId && !isLoading) ?
				<figure>
					<img src={`https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${imageId}/2400`}/>
					<figcaption>{caption}</figcaption>
				</figure>
			: <Spinner/>}
			<button className="close" onClick={handleClose}>&times;</button>
		</div>
	)
}

export default Lightbox;