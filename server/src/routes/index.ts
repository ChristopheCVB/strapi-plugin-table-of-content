export default {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/config/:uid',
        handler: 'admin.config',
        config: {
          policies: ['admin::isAuthenticatedAdmin'],
        },
      },
    ],
  },
}
