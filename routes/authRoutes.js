import authControllerFactory from "../controllers/authController.js";

const authRoutes = async (server) => {
  const models = server.app.models;
  const controller = authControllerFactory(models);

  return [
    {
      method: "POST",
      path: "/register",
      handler: controller.register
    },
    {
      method: "POST",
      path: "/login",
      handler: controller.login
    },
    {
      method: 'PUT',
      path: '/changePassword',
      handler: controller.changePassword
    }
  ];
};

export default authRoutes;
