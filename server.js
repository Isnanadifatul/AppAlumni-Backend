import 'dotenv/config';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import { dbPlugin } from './plugins/db.js';
import alumniRoutes from './routes/alumniRoutes.js';
import authRoutes from './routes/authRoutes.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: { cors: true }
  });

  await server.register(Inert);     // Untuk static file
  await server.register(dbPlugin);

  // Static folder untuk foto alumni
  server.route({
    method: 'GET',
    path: '/uploads/alumni/{filename}',
    handler: {
      directory: {
        path: 'uploads/alumni',
        listing: false,
      }
    }
  });

  server.route(await alumniRoutes(server));
  server.route(await authRoutes(server));

  await server.start();
  console.log('Server running on', server.info.uri);
};

init();
