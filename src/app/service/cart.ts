import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../interface/product.interface';

const STORAGE_KEY = 'ecom_cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly TAX_RATE = 0.08;
  readonly SHIPPING_COST = 10;

  readonly cartCount = signal(0);
  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private discountedPrice(product: Product): number {
    return product.price * (1 - (product.discountPercentage || 0) / 100);
  }

  addToCart(product: Product, quantity: number = 1) {
    const existing = this.items.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.update();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.update();
    }
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.update();
  }

  getCartItems(): CartItem[] {
    return this.items;
  }

  clearCart() {
    this.items = [];
    this.update();
  }

  getSubtotal(): number {
    return this.items.reduce(
      (total, item) => total + this.discountedPrice(item.product) * item.quantity,
      0,
    );
  }

  getTax(): number {
    return this.getSubtotal() * this.TAX_RATE;
  }

  getShippingCost(): number {
    return this.items.length > 0 ? this.SHIPPING_COST : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax() + this.getShippingCost();
  }

  private update() {
    this.cartSubject.next([...this.items]);
    this.cartCount.set(this.items.reduce((sum, item) => sum + item.quantity, 0));
    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    }
  }

  private loadFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.items = JSON.parse(stored);
        this.update();
      }
    }
  }
}
