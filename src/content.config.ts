import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    subtitle: z.string().optional(),
    pubDate: z.string().optional(),
  }),
});

export const collections = {
  'articles': articlesCollection,
};
