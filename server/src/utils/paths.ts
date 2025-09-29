import path from 'path';

// Root data directory (can be persisted on platforms like Render via a disk)
export const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');

export const dataPath = (relativePath: string) => path.join(DATA_DIR, relativePath);
