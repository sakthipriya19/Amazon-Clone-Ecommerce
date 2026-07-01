import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Cart } from './cart/cart';
import { Products } from './products/products';
import { PageError } from './page-error/page-error';
import { Checkout } from './checkout/checkout';
import { OrderConfirmation } from './order-confirmation/order-confirmation';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'products',
    component: Products,
  },
  {
    path: 'checkout',
    component: Checkout,
  },
  {
    path: 'order-confirmation/:orderId',
    component: OrderConfirmation,
  },
  {
    path: '',
    component: Home,
  },
  {
    path: '**',
    component: PageError,
  },
];
