import 'dotenv/config';
import Hapi from '@hapi/hapi';
import { dbPlugin } from './plugins/db.js';
import alumniRoutes from './routes/alumniRoutes.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: { cors: true }
  });

  // Register DB plugin
  await server.register(dbPlugin);

  // Register routes
  server.route(await alumniRoutes(server));

  await server.start();
  console.log('Server running on', server.info.uri);
};

init();
