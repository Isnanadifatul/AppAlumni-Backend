import authControllerFactory from '../controllers/authController.js';

const authRoutes = async (server) => {
  const models = server.app.models;
  const controller = authControllerFactory(models);

  return [
    {
      method: 'POST',
      path: '/register',
      handler: controller.register
    },
    {
      method: 'POST',
      path: '/login',
      handler: controller.login
    }
  ];
};

export default authRoutes;
