import { buildApp } from './app';

const app = buildApp();
const port = Number(process.env.API_PORT || 3333);

app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`API running on port ${port}`);
});