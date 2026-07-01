import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../interface/product.interface';
import { CartService } from './cart';

const STORAGE_KEY = 'ecom_orders';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private cartService: CartService) {
    this.loadFromStorage();
  }

  createOrder(
    customerEmail: string,
    customerName: string,
    address: string,
    paymentMethod: string,
  ): Order {
    const order: Order = {
      id: 'ORD-' + Date.now(),
      items: [...this.cartService.getCartItems()],
      subtotal: this.cartService.getSubtotal(),
      tax: this.cartService.getTax(),
      shippingCost: this.cartService.getShippingCost(),
      total: this.cartService.getTotal(),
      customerEmail,
      customerName,
      address,
      paymentMethod,
      status: 'completed',
      orderDate: new Date().toISOString(),
    };

    this.orders.unshift(order);
    this.saveToStorage();
    this.cartService.clearCart();
    return order;
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrdersByEmail(email: string): Order[] {
    return this.orders.filter((order) => order.customerEmail.toLowerCase() === email.toLowerCase());
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders.find((order) => order.id === orderId);
  }

  private saveToStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders));
    }
    this.ordersSubject.next([...this.orders]);
  }

  private loadFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.orders = JSON.parse(stored);
        this.ordersSubject.next([...this.orders]);
      }
    }
  }
}
