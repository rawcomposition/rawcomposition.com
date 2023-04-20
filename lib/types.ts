export type Country = {
  code: string;
  count: number;
};

export type Trip = {
  content: string;
  slug: string;
  title: string;
  subtitle?: string;
  length: string;
  month: string;
  species: number;
  lifers: number;
  isUS?: boolean;
  createdAt: string;
  featuredImg: string;
  ebirdLink?: string;
};

export type Species = {
  name: string;
  date: string;
  images: {
    id: string;
    w: number;
    h: number;
  }[];
};

export type KeyValue = {
  [key: string]: string;
};
