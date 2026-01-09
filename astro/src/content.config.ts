import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const trips = defineCollection({
	loader: glob({ base: './src/content/trips', pattern: '**/*.mdx' }),
	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		createdAt: z.coerce.date(),
		month: z.string(),
		species: z.number(),
		lifers: z.number(),
		length: z.string(),
		featuredImg: z.union([z.string(), z.number()]).transform((val) => String(val)),
		ebirdLink: z.string().url().optional(),
		isUS: z.boolean().optional(),
	}),
});

export const collections = { trips };
