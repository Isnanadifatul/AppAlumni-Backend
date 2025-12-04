import Inert from '@hapi/inert';
import alumniControllerFactory from '../controllers/alumniController.js';

const alumniRoutes = async (server) => {
  await server.register(Inert);

  const models = server.app.models; // <–– INI WAJIB ADA
  const controller = alumniControllerFactory(models); // <–– KIRIM MODELS

  return [
    {
      method: 'POST',
      path: '/inputAlumni',
      handler: controller.create,
      options: {
        payload: {
          maxBytes: 10 * 1024 * 1024,
          parse: true,
          output: 'stream',
          multipart: true
        }
      }
    },
    {
      method: 'GET',
      path: '/listAlumni',
      handler: controller.list
    },
    {
      method: 'GET',
      path: '/listIdAlumni/{id}',
      handler: controller.get
    },
    {
      method: 'GET',
      path: '/searchAlumni/{nim}',
      handler: controller.get
    },
    {
      method: 'PUT',
      path: '/editAlumni/{id}',
      handler: controller.update,
      options: {
        payload: {
          maxBytes: 10 * 1024 * 1024,
          parse: true,
          output: 'stream',
          multipart: true
        }
      }
    },
    {
      method: 'DELETE',
      path: '/deleteAlumni/{id}',
      handler: controller.remove
    }
  ];
};

export default alumniRoutes;
