import { readdirSync, writeFileSync } from 'node:fs';

const files: string[] = readdirSync('src').filter(file => file.endsWith('.ts')).map(file => `src/${file}`);

const exportLines = files.map(file => `export * from './${file.replace('.ts', '')}'`).join(';\n');

writeFileSync('main.ts', exportLines + ';\n');