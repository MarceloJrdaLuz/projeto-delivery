import { Router } from 'express'
import CartsControllers from './controllers/CartsControllers'
import PostBackController from './controllers/PostbackController'
import TransactionsControllers from './controllers/TransactionsControllers'
import AuthControllers from './controllers/AuthControllers'
import OrdersControllers from './controllers/OrdersControllers'
import ProductsControllers from './controllers/ProductsControllers'
import auth from './middlewares/auth'


const routes = new Router()

routes.post('/auth/register', AuthControllers.create) 
routes.post('/authenticated', AuthControllers.auth)
routes.get('/users', AuthControllers.getUsers)
routes.post('/forgot_password', AuthControllers.forgot_password)
routes.post('/reset_password', AuthControllers.reset_password)


routes.get('/carts',  auth.authMiddlewares, CartsControllers.index)
routes.post('/carts', CartsControllers.create)
routes.put('/carts/:id', CartsControllers.update)
routes.delete('/carts/:id', CartsControllers.destroy)

routes.post('/orders', OrdersControllers.getOrders)
routes.post('/new-order', OrdersControllers.newOrder)
routes.delete('/clean-orders', auth.IsAdmin, OrdersControllers.ordersClean)

routes.post('/products', auth.IsAdmin, ProductsControllers.create)
routes.get('/products-menu/:category', ProductsControllers.getProducts)

routes.post('/transactions',  auth.authMiddlewares, TransactionsControllers.create)
routes.post('/transactions/webhook/pagseguro', PostBackController.pagseguro)

export default routes