// src/lib/components/map/queue.ts
type QueueCommand = [string, unknown[]];
type CommandMap = Record<string, (...args: unknown[]) => unknown>;

/** Buffers map commands sent before the map is ready, then runs them (and later ones) against it. */
export class EventQueue {
	private pending: QueueCommand[] = [];
	private target: CommandMap | null = null;

	send(command: string, params: unknown[] = []): void {
		if (!command) {
			return;
		}
		if (this.target) {
			this.run(this.target, command, params);
		} else {
			this.pending.push([command, params]);
		}
	}

	start(map: CommandMap): void {
		this.target = map;
		for (const [command, params] of this.pending.splice(0)) {
			this.run(map, command, params);
		}
	}

	stop(): void {
		this.target = null;
		this.pending = [];
	}

	private run(map: CommandMap, command: string, params: unknown[]): void {
		const handler = map[command];
		if (typeof handler === 'function') {
			handler.apply(map, params);
		}
	}
}
