import path from 'path';

// Root data directory
// - Local/dev: use repo's data folder
// - Vercel/serverless: use writable temp directory (/tmp)
export const DATA_DIR = process.env.DATA_DIR || (process.env.VERCEL ? '/tmp/finset-data' : path.join(__dirname, '../../data'));

export const dataPath = (relativePath: string) => path.join(DATA_DIR, relativePath);
