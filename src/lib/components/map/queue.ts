// src/lib/components/map/queue.ts
import { writable, type Unsubscriber, type Writable } from 'svelte/store';

type QueueCommand = [string, unknown[]];
type CommandMap = Record<string, (...args: unknown[]) => unknown>;

export class EventQueue {
	private queue: Writable<QueueCommand[]>;
	private unsubscribe: Unsubscriber | null;
	private started: boolean;

	constructor() {
		this.queue = writable([]);
		this.unsubscribe = null;
		this.started = false;
	}

	send(command: string, params: unknown[] = []): void {
		if (!command) {
			return;
		}
		this.queue.update((q) => [...q, [command, params]]);
	}

	start(map: CommandMap): void {
		// Starting event queue
		this.unsubscribe = this.queue.subscribe((queue) => {
			while (queue.length) {
				const next = queue.shift();
				if (!next) {
					continue;
				}
				const [command, params] = next;
				const handler = map[command];
				if (typeof handler === 'function') {
					handler.apply(map, params);
				}
			}
		});
		this.started = true;
	}

	stop(): void {
		if (!this.started) {
			return;
		}
		this.unsubscribe?.();
		this.queue = writable([]);
		this.started = false;
	}
}
