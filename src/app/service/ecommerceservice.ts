import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { ecommerce, CartItem, Order } from '../interface/ecoomerceinterface';

@Injectable({
  providedIn: 'root',
})
export class Ecommerceservice {
  url = 'http://localhost:3000/clothing';
  readonly cartCount = signal(0);
  private cartItems: CartItem[] = [];
  private orders: Order[] = [];
  private cartAddService = new BehaviorSubject<CartItem[]>([]);
  private orderService = new BehaviorSubject<Order[]>([]);
  cart$ = this.cartAddService.asObservable();
  orders$ = this.orderService.asObservable();
  
  readonly TAX_RATE = 0.08;
  readonly SHIPPING_COST = 10;
  
  constructor(private http: HttpClient) {
    this.loadOrdersFromLocalStorage();
  }

  // Get all products
  getClothingDetails(): Observable<ecommerce[]> {
    return this.http.get<ecommerce[]>(this.url);
  }

  // Cart Management
  setCartAddService(item: ecommerce, quantity: number = 1, selectedSize?: string, selectedColor?: string) {
    const existingItem = this.cartItems.find(
      (cartItem) => cartItem.id === item.id && 
      cartItem.selectedSize === selectedSize && 
      cartItem.selectedColor === selectedColor
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem: CartItem = {
        ...item,
        quantity,
        selectedSize,
        selectedColor,
      };
      this.cartItems.push(cartItem);
    }
    this.updateCart();
  }

  updateCartItemQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find((item) => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.updateCart();
    }
  }

  removeFromCart(productId: number, selectedSize?: string, selectedColor?: string) {
    this.cartItems = this.cartItems.filter(
      (item) => !(item.id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor)
    );
    this.updateCart();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart() {
    this.cartAddService.next([...this.cartItems]);
    this.cartCount.set(this.cartItems.length);
  }

  // Calculate totals
  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTax(): number {
    return this.getSubtotal() * this.TAX_RATE;
  }

  getShippingCost(): number {
    return this.cartItems.length > 0 ? this.SHIPPING_COST : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax() + this.getShippingCost();
  }

  // Order Management
  createOrder(customerEmail: string, customerName: string, address: string, paymentMethod: string): Order {
    const order: Order = {
      id: 'ORD-' + Date.now(),
      items: [...this.cartItems],
      subtotal: this.getSubtotal(),
      tax: this.getTax(),
      shippingCost: this.getShippingCost(),
      total: this.getTotal(),
      customerEmail,
      customerName,
      address,
      paymentMethod,
      status: 'completed',
      orderDate: new Date(),
    };
    
    this.orders.push(order);
    this.saveOrdersToLocalStorage();
    this.clearCart();
    return order;
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders.find((order) => order.id === orderId);
  }

  private saveOrdersToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('orders', JSON.stringify(this.orders));
    }
  }

  private loadOrdersFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('orders');
      if (stored) {
        this.orders = JSON.parse(stored);
        this.orderService.next(this.orders);
      }
    }
  }

  saveCartToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  loadCartFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (stored) {
        this.cartItems = JSON.parse(stored);
        this.updateCart();
      }
    }
  }
}
