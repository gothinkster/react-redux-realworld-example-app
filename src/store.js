const Redux = require('redux');
const middleware = require('./middleware');
const reducer = require('./reducer');

const applyMiddleware = Redux.applyMiddleware(middleware.promiseMiddleware,
  middleware.localStorageMiddleware);

const store = Redux.createStore(reducer, applyMiddleware);

module.exports = store;
