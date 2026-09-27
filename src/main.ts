import { connect, disconnect } from './client';
import { clearPresence, flushPending } from './presence';

let flushInterval: NodeJS.Timeout | null = null;

export async function initPresence(clientId: string) {
    await connect(clientId);
    flushInterval = setInterval(flushPending, 15000);
}

export function shutdownPresence() {
    if (flushInterval) clearInterval(flushInterval);
    clearPresence();
    disconnect();
}