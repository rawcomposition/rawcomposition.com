import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Trip } from "lib/types";

const perPage = 20;

export const getTrips = async (page: number) => {
  const dirFiles = fs.readdirSync(path.join(process.cwd(), "trips"), {
    withFileTypes: true,
  });

  const trips: Trip[] = dirFiles.map((file) => {
    const fileContent = fs.readFileSync(path.join(process.cwd(), "trips", file.name), "utf-8");
    const { data, content } = matter(fileContent);
    const slug = file.name.replace(/.mdx$/, "");
    return { content, slug, ...(data as any) };
  });

  return trips
    .sort((a, b) => a.createdAt.toString().localeCompare(b.createdAt.toString(), "en"))
    .reverse()
    .slice((page - 1) * perPage, page * perPage);
};

export const getTrip = async (slug: string) => {
  const fileContent = fs.readFileSync(path.join(process.cwd(), "trips", `${slug}.mdx`), "utf-8");
  return matter(fileContent);
};

export const countTrips = async () => {
  const dirFiles = fs.readdirSync(path.join(process.cwd(), "trips"), {
    withFileTypes: true,
  });

  return dirFiles.length || 0;
};

export const getPaths = async () => {
  const dirFiles = fs.readdirSync(path.join(process.cwd(), "trips"), {
    withFileTypes: true,
  });

  return dirFiles.map((file) => {
    const slug = file.name.replace(/.mdx$/, "");
    return { params: { slug } };
  });
};
