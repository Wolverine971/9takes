import type { PageServerLoad } from './$types';
import { getMentalHealthPosts } from '$lib/utils/blog';

export const load = (async () => {
  // Get mental health blog posts
  const mentalHealthBlogs = await getMentalHealthPosts();

  return {
    mentalHealthBlogs
  };
}) satisfies PageServerLoad;