import { Client } from '@xhayper/discord-rpc';

let client: Client | null = null;

export function connect(clientId: string): Promise<void> {
    return new Promise(resolve => {
        client = new Client({ clientId });

        client.on('ready', () => {
            resolve();
        })

        client.on('disconnected', () => {
            setTimeout(() => reconnect(clientId), 5e3);
        })

        client.login().catch(err => {
            console.error('Login failed', err);
        })
    })
}

function reconnect(clientId: string) {
    connect(clientId).catch(() => {});
}

export function disconnect() {
    client?.destroy();
    client = null;
}

export function getClient(): Client | null {
    return client;
}