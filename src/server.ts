import { port } from './config';
import app from './app';
import globalError from './middlewares/ErrorMiddleware';

app.use(globalError);

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});

