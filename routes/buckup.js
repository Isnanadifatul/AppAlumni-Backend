import Inert from '@hapi/inert';
import alumniControllerFactory from '../controllers/alumniController.js';

const alumniRoutes = async (server) => {
  await server.register(Inert);

  const models = server.app.models || {};
  const controller = alumniControllerFactory(models);

  return [
    {
      method: 'GET',
      path: '/',
      handler: () => ({ message: 'Server is running...' })
    },

    {
      method: 'POST',
      path: '/alumni',
      handler: controller.create,
      options: {
        description: 'Create alumni',
        payload: {
          maxBytes: 10 * 1024 * 1024,
          output: 'stream',
          allow: 'multipart/form-data',
          parse: true,
          multipart: true

        }
      }
    },

    {
      method: 'GET',
      path: '/alumni',
      handler: controller.list
    },

    {
      method: 'GET',
      path: '/alumni/{id}',
      handler: controller.get
    },

    {
      method: 'PUT',
      path: '/alumni/{id}',
      handler: controller.update,
      options: {
        payload: {
          maxBytes: 10 * 1024 * 1024,
          parse: true
        }
      }
    },

    {
      method: 'DELETE',
      path: '/alumni/{id}',
      handler: controller.remove
    },

    {
      method: 'GET',
      path: '/uploads/{param*}',
      handler: {
        directory: {
          path: 'uploads',
          listing: false,
          index: false
        }
      },
      options: {
        auth: false
      }
    }
  ];
};

export default alumniRoutes;
