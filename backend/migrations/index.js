import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.js') && file !== 'index.js')
        .sort();

    console.log('\n📦 Running migrations...\n');

    for (const file of files) {
        const migrationUrl = `file://${path.join(migrationsDir, file).replace(/\\/g, '/')}`;
        const migration = await import(migrationUrl);
        try {
            await migration.up();
        } catch (error) {
            console.error(`Failed to run migration ${file}:`, error.message);
            process.exit(1);
        }
    }

    console.log('\n✅ All migrations completed!\n');
}

export async function rollbackMigrations() {
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.js') && file !== 'index.js')
        .sort()
        .reverse();

    console.log('\n⏮️  Rolling back migrations...\n');

    for (const file of files) {
        const migrationUrl = `file://${path.join(migrationsDir, file).replace(/\\/g, '/')}`;
        const migration = await import(migrationUrl);
        try {
            await migration.down();
        } catch (error) {
            console.error(`Failed to rollback migration ${file}:`, error.message);
        }
    }

    console.log('\n✅ All migrations rolled back!\n');
    process.exit(0);
}