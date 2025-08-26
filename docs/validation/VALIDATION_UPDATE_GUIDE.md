# Validation Update Guide for questions/[slug]/+page.server.ts

## How to Update the Actions

Add these imports at the top of the file:

```typescript
import { logger } from '$lib/utils/logger';
import {
	createCommentSchema,
	likeCommentSchema,
	subscribeSchema,
	saveLinkClickSchema,
	flagCommentSchema,
	updateQuestionImgSchema,
	validateFormData
} from '$lib/validation/questionSchemas';
```

## Update Each Action

### 1. createComment Action

```typescript
createComment: async ({ request, getClientAddress }) => {
  try {
    const { body, demo_time } = await getRequestData(request);

    // Validate the comment data
    const validatedData = createCommentSchema.parse(body);

    logger.info('Creating comment', {
      parentId: validatedData.parent_id,
      parentType: validatedData.parent_type
    });

    const commentData = await createCommentData(validatedData, getClientAddress(), demo_time);
    const result = await handleCommentCreation(commentData, validatedData.parent_type, demo_time);

    logger.info('Comment created successfully');
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      logger.warn('Invalid comment data', { errors: e.errors });
      throw error(400, {
        message: 'Invalid comment data',
        details: e.errors
      });
    }
    logger.error('Error creating comment', e as Error);
    throw error(500, 'Failed to create comment');
  }
},
```

### 2. likeComment Action

```typescript
likeComment: async ({ request, locals }) => {
  try {
    const session = locals.session;
    if (!session?.user?.id) {
      logger.warn('Unauthorized like attempt');
      throw error(401, 'Unauthorized');
    }

    const { body, demo_time } = await getRequestData(request);
    const validatedData = likeCommentSchema.parse(body);

    logger.info('Processing comment like', {
      commentId: validatedData.parent_id,
      operation: validatedData.operation,
      userId: validatedData.user_id
    });

    if (validatedData.es_id) {
      await addESCommentLike({
        commentId: validatedData.es_id,
        operation: validatedData.operation
      });
    }

    if (validatedData.operation === 'add') {
      return await addLike(validatedData.parent_id, validatedData.user_id);
    } else {
      return await removeLike(validatedData.parent_id, validatedData.user_id, demo_time);
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      logger.warn('Invalid like data', { errors: e.errors });
      throw error(400, {
        message: 'Invalid like data',
        details: e.errors
      });
    }
    logger.error('Error processing like', e as Error);
    throw error(500, 'Failed to process like');
  }
},
```

### 3. subscribe Action

```typescript
subscribe: async ({ request, locals }) => {
  try {
    const session = locals.session;
    if (!session?.user?.id) {
      logger.warn('Unauthorized subscription attempt');
      throw error(401, 'Unauthorized');
    }

    const { body, demo_time } = await getRequestData(request);
    const validatedData = subscribeSchema.parse(body);

    logger.info('Processing subscription', {
      questionId: validatedData.parent_id,
      operation: validatedData.operation,
      userId: validatedData.user_id
    });

    if (validatedData.es_id) {
      await addESSubscription({
        questionId: validatedData.es_id,
        operation: validatedData.operation
      });
    }

    if (validatedData.operation === 'add') {
      return await addSubscription(validatedData.parent_id, validatedData.user_id, demo_time);
    } else {
      return await removeSubscription(validatedData.parent_id, validatedData.user_id, demo_time);
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      logger.warn('Invalid subscription data', { errors: e.errors });
      throw error(400, {
        message: 'Invalid subscription data',
        details: e.errors
      });
    }
    logger.error('Error processing subscription', e as Error);
    throw error(500, 'Failed to process subscription');
  }
},
```

### 4. saveLinkClick Action

```typescript
saveLinkClick: async ({ request }) => {
  try {
    const validatedData = await validateFormData(saveLinkClickSchema, request);

    logger.info('Recording link click', { linkId: validatedData.linkId });

    await incrementLinkClicks(validatedData.linkId);
    return true;
  } catch (e) {
    if (e instanceof z.ZodError) {
      logger.warn('Invalid link click data', { errors: e.errors });
      throw error(400, 'Invalid link ID');
    }
    logger.error('Error saving link click', e as Error);
    throw error(500, 'Failed to save link click');
  }
},
```

### 5. flagComment Action

```typescript
flagComment: async ({ request, locals }) => {
  try {
    const session = locals.session;
    if (!session?.user?.id) {
      logger.warn('Unauthorized flag attempt');
      throw error(401, 'Unauthorized');
    }

    const validatedData = await validateFormData(flagCommentSchema, request);

    logger.info('Flagging comment', {
      commentId: validatedData.comment_id,
      userId: session.user.id
    });

    await flagComment(session.user.id, validatedData.comment_id, validatedData.description);

    logger.info('Comment flagged successfully');
    return { success: true };
  } catch (e) {
    if (e instanceof z.ZodError) {
      logger.warn('Invalid flag data', { errors: e.errors });
      throw error(400, {
        message: e.errors[0].message
      });
    }
    logger.error('Error flagging comment', e as Error);
    throw error(500, 'Failed to flag comment');
  }
},
```

### 6. updateQuestionImg Action

```typescript
updateQuestionImg: async ({ request, locals }) => {
	try {
		const session = locals.session;
		if (!session?.user?.id) {
			logger.warn('Unauthorized image update attempt');
			throw error(401, 'Unauthorized');
		}

		const validatedData = await validateFormData(updateQuestionImgSchema, request);

		logger.info('Updating question image', {
			url: validatedData.url,
			userId: session.user.id
		});

		const imgPath = await uploadImage(validatedData.img_url, validatedData.url);
		await updateQuestionImageUrl(validatedData.url, imgPath);

		logger.info('Question image updated successfully');
		return true;
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid image update data', { errors: e.errors });
			throw error(400, {
				message: e.errors[0].message
			});
		}
		logger.error('Error updating question image', e as Error);
		throw error(500, 'Failed to update question image');
	}
};
```

## Benefits of These Updates

1. **Input Validation**: All user inputs are validated with Zod schemas
2. **Type Safety**: TypeScript knows the exact shape of validated data
3. **Better Error Messages**: Users get meaningful error messages
4. **Consistent Logging**: All actions log their operations
5. **Security**: Prevents SQL injection and other input-based attacks
6. **Debugging**: Easier to track issues with detailed logging
