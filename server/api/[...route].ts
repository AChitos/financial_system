import serverless from 'serverless-http';
import app from '../dist/app';

// Wrap the Express app with serverless-http to run on Vercel Functions
const handler = serverless(app);

export default handler;
