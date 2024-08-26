# Nested Comments Component Requirements

## Tech Stack

- SvelteKit
- TypeScript
- Flowbite-Svelte
- Supabase

## Components

### Comments Component

- Display the number of total comments
- Default to displaying 10 comments on load
- Include a button to load more comments (makes an API call to Supabase to get the next 10 comments)
- Add a settings icon that allows a user to flag a comment
  - Clicking this icon should open a modal
  - The modal should offer several predefined options for flagging a comment
  - Include an "Other" option where users can provide a custom reason with an explanation
- Implement expand and collapse feature for comment threads
- Add sorting options (e.g., newest, oldest, most liked)

### Comment Component

- Display the comment content
- Truncate long comments with a "read more" button to expand
- Show likes count and allow users to like the comment
- Support nested comments (comments on comments)
- Allow comment editing for the comment author
- Add a "reply" button to make it clear how to respond to specific comments
- Display an "edited" indicator on modified comments
- Show relative timestamps (e.g., "2 hours ago") and update them dynamically
- Allow basic rich text formatting (bold, italic, links) in comments

### Flag Comment Modal Component

- Separate modal component for flagging comments
- Display predefined options for flagging
- Include an "Other" option with a text input for custom reasons

## Additional Features and Considerations

1. Optimistic UI updates:

   - Update the UI immediately when a user likes or posts a comment, then sync with the server in the background for a smoother experience

2. Accessibility:

   - Ensure the comment system is keyboard-navigable and screen-reader friendly

3. Data modeling:

   - Use a flat structure in the database with a "parent_id" field instead of deeply nested structures for easier querying and management

4. Performance optimization:

   - Implement pagination or virtualization for deeply nested comment threads

5. Real-time updates:

   - Implement real-time updates using Supabase's real-time features for new comments, likes, and edits

6. User mentions and notifications:

   - Allow users to mention others in comments using "@username"
   - Implement a notification system for replies and mentions

7. Comment editing:

   - Implement a time limit for editing comments

8. Caching:

   - Implement caching strategies to reduce database load for popular comment threads

9. Rate limiting:

   - Implement rate limiting on the API to prevent spam and abuse

10. Deleted comments:

    - Decide how to handle deleted comments, especially if they have replies

11. User profiles:
    - Link comments to user profiles, allowing viewers to see a user's comment history
