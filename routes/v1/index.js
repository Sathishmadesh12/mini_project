const express = require('express');
const countryRoute = require('./country.route');
const stateRoute = require('./state.route');
const user1Route = require('./user1.route');
const numberRoute = require('./number.routes');
const customerRoute = require('./customer.route');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/country',
    route: countryRoute,
  },
  {
    path: '/state',
    route: stateRoute,
  },
  {
    path: '/user1',
    route:user1Route,
  },
  {
    path: '/number',
    route:numberRoute,
  },
  {
    path: '/customer',
    route:customerRoute,
  },
];
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
