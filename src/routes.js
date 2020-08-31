import { Router } from 'express';

import UserController from './app/controllers/UserController';
import CustomerController from './app/controllers/CustomerController';
import SessionController from './app/controllers/SessionController';
import ChangePasswordController from './app/controllers/ChangePasswordController';
import OrderController from './app/controllers/OrderController';
import PaymentTypeController from './app/controllers/PaymentTypeController';
import StatusController from './app/controllers/StatusController';
import FinishingController from './app/controllers/FinishingController';
import MaterialController from './app/controllers/MaterialController';
import ColorController from './app/controllers/ColorController';
import CarrierController from './app/controllers/CarrierController';
import FreightTypeController from './app/controllers/FreightTypeController';
import CompanyController from './app/controllers/CompanyController';
import PrintOrderController from './app/controllers/PrintOrderController';

import authMiddleware from './app/middlewares/auth';
import adminOnly from './app/middlewares/adminOnly';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.post('/refresh-token', SessionController.refresh);

routes.use(authMiddleware);

routes.put('/change-password', ChangePasswordController.update);

routes.post('/company', CompanyController.update);
routes.get('/company', CompanyController.show);

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes
  .route('/users/:id', adminOnly)
  .get(UserController.show)
  .put(UserController.update)
  .delete(UserController.delete);

routes.post('/customers', CustomerController.store);
routes.get('/customers', CustomerController.index);
routes
  .route('/customers/:id', adminOnly)
  .get(CustomerController.show)
  .put(CustomerController.update)
  .delete(CustomerController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes
  .route('/orders/:id', adminOnly)
  .get(OrderController.show)
  .put(OrderController.update)
  .delete(OrderController.delete);

routes.get('/print-order/:id', PrintOrderController.show);

routes.post('/payment-type', PaymentTypeController.store);
routes.get('/payment-type', PaymentTypeController.index);
routes
  .route('/payment-type/:id', adminOnly)
  .get(PaymentTypeController.show)
  .put(PaymentTypeController.update)
  .delete(PaymentTypeController.delete);

routes.post('/status', StatusController.store);
routes.get('/status', StatusController.index);
routes
  .route('/status/:id', adminOnly)
  .get(StatusController.show)
  .put(StatusController.update)
  .delete(StatusController.delete);

routes.post('/finishings', FinishingController.store);
routes.get('/finishings', FinishingController.index);
routes
  .route('/finishings/:id', adminOnly)
  .get(FinishingController.show)
  .put(FinishingController.update)
  .delete(FinishingController.delete);

routes.post('/materials', MaterialController.store);
routes.get('/materials', MaterialController.index);
routes
  .route('/materials/:id', adminOnly)
  .get(MaterialController.show)
  .put(MaterialController.update)
  .delete(MaterialController.delete);

routes.post('/colors', ColorController.store);
routes.get('/colors', ColorController.index);
routes
  .route('/colors/:id', adminOnly)
  .get(ColorController.show)
  .put(ColorController.update)
  .delete(ColorController.delete);

routes.post('/carriers', CarrierController.store);
routes.get('/carriers', CarrierController.index);
routes
  .route('/carriers/:id', adminOnly)
  .get(CarrierController.show)
  .put(CarrierController.update)
  .delete(CarrierController.delete);

routes.post('/freight-types', FreightTypeController.store);
routes.get('/freight-types', FreightTypeController.index);
routes
  .route('/freight-types/:id', adminOnly)
  .get(FreightTypeController.show)
  .put(FreightTypeController.update)
  .delete(FreightTypeController.delete);

export default routes;
