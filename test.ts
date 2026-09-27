import { initPresence, shutdownPresence } from './src/main';
import { updatePresence } from './src/presence';
import { applicationId } from './config.json';
import { OUTCOME, PLATFORM } from './src/presence';

async function main() {
    await initPresence(applicationId);

    updatePresence({
        phase: 'BETTING',
        balance: 1550,
        round: 6,
        lastOutcome: {
            outcome: OUTCOME.BLACKJACK,
            value: 300
        },
        platform: PLATFORM.CLI,
        version: '1.2.2'
    })

    console.log('done');
}

main().catch(console.error);

process.on('SIGINT', () => {
    shutdownPresence();
    process.exit(0);
})