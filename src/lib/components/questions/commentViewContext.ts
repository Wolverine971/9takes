// src/lib/components/questions/commentViewContext.ts
// The question page's take-view observer. QuestionContent sets it; every
// Comment card below it (ranked list, reply focus, nested replies) reads it.
import { createContext } from 'svelte';
import type { Comment } from '$lib/types/questions';

export type CommentViewObserver = (node: Element, take: Comment) => void | (() => void);

const [getObserver, setObserver, hasObserver] = createContext<CommentViewObserver>();

export const setCommentViewObserver = setObserver;

/** Undefined outside a question page (Comment also renders standalone). */
export function getCommentViewObserver(): CommentViewObserver | undefined {
	return hasObserver() ? getObserver() : undefined;
}
