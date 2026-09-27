import { getClient } from './client';
import { largeImageKey, largeImageText } from '../config.json';

export const enum PLATFORM { CLI = 'cli' };
export const enum OUTCOME {
    BUST = 'bust',
    WIN = 'win',
    BLACKJACK = 'blackajck',
    LOSS = 'loss',
    PUSH = 'push'
}

export interface Outcome {
    outcome: OUTCOME;
    value: number;
}

export interface RPC {
    balance?: number;
    round?: number;
    phase?: string;
    lastOutcome?: Outcome;

    startedAt?: number;

    platform: PLATFORM;
    version: string;
}

let lastUpdate: number = 0;
const THROTTLE_MS: number = 15e3;
let pending: RPC | null = null;

function setPresence(rpc: RPC) {
    const client = getClient();
    if (!client) return;

    client.user?.setActivity({
        details: rpc.phase ? `${rpc.phase} : ${rpc.balance}G | ${rpc.round} round${rpc.round && rpc.round > 1 ? 's' : ''}` : 'Idling',
        // state: rpc.phase ? `${rpc.lastOutcome?.outcome.toUpperCase()} : ${rpc.lastOutcome?.value && rpc.lastOutcome?.value >= 0 ? '+' : ''}${rpc.lastOutcome?.value}G` : '',
        startTimestamp: rpc.startedAt,
        largeImageKey: largeImageKey,
        largeImageText: largeImageText,
        smallImageKey: rpc.platform,
        smallImageText: `${rpc.platform.toUpperCase()} V${rpc.version}`
    })
}

export function updatePresence(rpc: RPC) {
    const now: number = Date.now();

    if (now - lastUpdate < THROTTLE_MS) {
        pending = rpc;
        return;
    }

    setPresence(rpc);
    lastUpdate = now;
}

export function clearPresence() {
    getClient()?.user?.clearActivity();
}

export function flushPending() {
    if (pending) {
        setPresence(pending);
        lastUpdate = Date.now();
        pending = null;
    }
}