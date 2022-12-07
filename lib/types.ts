export type FlickrPhoto = {
  farm: string;
  server: string;
  id: string;
  secret: string;
  title: string;
  o_width: string;
  o_height: string;
  description: {
    _content: string;
  };
};

export type FlickrResponse = {
  page: number;
  pages: number;
  perpage: number;
  total: number;
  photo: FlickrPhoto[];
};

export type Country = {
  code: string;
  count: number;
};

export type Trip = {
  content: string;
  slug: string;
  title: string;
  length: string;
  month: string;
  species: number;
  lifers: number;
  isUS?: boolean;
  createdAt: string;
  featuredImg: string;
};

export type KeyValue = {
  [key: string]: string;
};
