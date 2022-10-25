import { FlickrPhoto } from "lib/types";

function FlickrItem({ farm, server, id, secret, title, o_width, o_height, description }: FlickrPhoto) {
  const url1x = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_z.jpg`;
  const url2x = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_b.jpg`;

  return (
    <article className="mb-8">
      <a href={"https://www.flickr.com/photos/rawcomposition/" + id} target="_blank">
        <img
          src={url1x}
          srcSet={`${url1x} 640w, ${url2x} 1024w`}
          width={o_width}
          height={o_height}
          alt=""
          loading="lazy"
        />
      </a>
      <div className="bg-white px-10 py-8">
        <h2 className="font-bold mb-4 font-heading text-gray-700">{title}</h2>
        <p className="text-sm text-neutral-500">{description._content}</p>
      </div>
    </article>
  );
}

export default FlickrItem;