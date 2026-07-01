import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Cart } from './cart/cart';
import { Products } from './products/products';
import { ProductDetail } from './product-detail/product-detail';
import { Wishlist } from './wishlist/wishlist';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { PageError } from './page-error/page-error';
import { Checkout } from './checkout/checkout';
import { Orders } from './orders/orders';
import { OrderConfirmation } from './order-confirmation/order-confirmation';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'products',
    component: Products,
  },
  {
    path: 'product/:id',
    component: ProductDetail,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'wishlist',
    component: Wishlist,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: Signup,
  },
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    component: Orders,
    canActivate: [authGuard],
  },
  {
    path: 'order-confirmation/:orderId',
    component: OrderConfirmation,
  },
  {
    path: '**',
    component: PageError,
  },
];
