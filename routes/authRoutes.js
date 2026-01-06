import authControllerFactory from "../controllers/authController.js";

const authRoutes = async (server) => {
  const models = server.app.models;
  const controller = authControllerFactory(models);

  return [
    {
      method: "POST",
      path: "/register",
      handler: controller.register,
       options:{
       auth: false
      }
    },
    {
      method: "POST",
      path: "/login",
      handler: controller.login,
       options:{
       auth: false
      }
    },
    {
      method: 'PUT',
      path: '/changePassword',
      handler: controller.changePassword
    },
    {
      method: 'GET',
      path: '/listUser',
      handler: controller.listUsers
    },
    {
      method: 'PUT',
      path: '/updateEmail/{id}',
      handler: controller.updateUsername
}

  ];
};

export default authRoutes;
