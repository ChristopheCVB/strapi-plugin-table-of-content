export default {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/config/:uid',
        handler: 'admin.configByUID',
        config: {
          policies: ['admin::isAuthenticatedAdmin'],
        },
      },
    ],
  },
}
