import * as React from "react";
import FlickrItem from "components/FlickrItem";
import { getPhotos } from "helpers/flickr";
import { FlickrPhoto } from "lib/types";

type State = {
  page: number;
  photos: FlickrPhoto[];
  pages: number | null;
  loading: boolean;
};

function FlickrMore() {
  const [state, setState] = React.useState<State>({
    page: 1,
    photos: [],
    loading: false,
    pages: null,
  });

  const { page, photos, loading, pages } = state;

  const handleLoadMore = async (fetchPage: number) => {
    setState((state) => ({ ...state, loading: true }));
    const data = await getPhotos(fetchPage);
    setState((state) => ({
      page: state.page + 1,
      loading: false,
      pages: data.pages,
      photos: [...state.photos, ...data.photo],
    }));
  };

  return (
    <>
      <div className="flickr-list">
        {photos.map((photo) => {
          return <FlickrItem key={photo.id} {...photo} />;
        })}
      </div>
      {pages !== page && (
        <button
          disabled={loading}
          className="bg-[#f4793d] text-white py-2 px-8 mb-8 mx-auto block"
          onClick={() => handleLoadMore(page + 1)}
        >
          {loading ? "loading..." : "Load More"}
        </button>
      )}
    </>
  );
}

export default FlickrMore;
