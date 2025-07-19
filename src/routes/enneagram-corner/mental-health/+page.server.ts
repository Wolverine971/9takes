import type { PageServerLoad } from './$types';
import { getBlogPosts } from '$lib/utils/blog';

export const load = (async () => {
  // Get all blog posts
  const allPosts = await getBlogPosts();
  
  // Filter for mental health blogs
  const mentalHealthBlogs = allPosts.filter(post => {
    // Check if the post is in the mental-health directory or has mental-health type
    return post.loc.includes('/mental-health/') || 
           (post.type && post.type.includes('mental-health')) ||
           post.loc.includes('enneagram-and-mental-illness');
  }).sort((a, b) => {
    // Sort by date, newest first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return {
    mentalHealthBlogs
  };
}) satisfies PageServerLoad;