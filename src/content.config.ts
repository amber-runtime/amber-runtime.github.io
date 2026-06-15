import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sections = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/case' }),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    num: z.string(),
    label: z.string(),
    title: z.string(),
  }),
});

export const collections = { sections };
