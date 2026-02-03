import { runMigrations } from './migrations/index.js';

runMigrations().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});
