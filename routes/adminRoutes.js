// routes/adminRoutes.js
import adminControllerFactory from '../controllers/adminController.js';

const adminRoutes = async (server) => {
  const models = server.app.models;
  const controller = adminControllerFactory(models);

  return [
    {
      method: 'POST',
      path: '/inputAdmin',
      handler: controller.create
    },
     {
      method: 'GET',
      path: '/listAdmin',
      handler: controller.listAdmin
    }
  ];
};

export default adminRoutes;
