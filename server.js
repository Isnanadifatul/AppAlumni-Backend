import 'dotenv/config';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Jwt from '@hapi/jwt';

import { dbPlugin } from './plugins/db.js';
import alumniRoutes from './routes/alumniRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: { cors: true }
  });

  await server.register([
    Inert,
    Jwt,
    dbPlugin
  ]);

  /* =======================
     JWT AUTH STRATEGY
  ======================= */
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 24 * 60 * 60 // 1 hari
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload
      };
    }
  });

  /* =======================
     DEFAULT: SEMUA ROUTE
     WAJIB LOGIN
  ======================= */
  server.auth.default('jwt');

  /* =======================
     STATIC FILE (PUBLIK)
  ======================= */
  server.route({
    method: 'GET',
    path: '/uploads/alumni/{filename}',
    options: { auth: false },
    handler: {
      directory: {
        path: 'uploads/alumni',
        listing: false
      }
    }
  });

  /* =======================
     ROUTES
  ======================= */
  server.route(await authRoutes(server));   // login → auth:false di router
  server.route(await alumniRoutes(server)); // campuran
  server.route(await adminRoutes(server));  // protected

  await server.start();
  console.log('Server running on', server.info.uri);
};

init();
