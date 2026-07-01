import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interface/product.interface';

const STORAGE_KEY = 'ecom_wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  readonly wishlistCount = signal(0);
  private items: Product[] = [];
  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  isInWishlist(productId: number): boolean {
    return this.items.some((item) => item.id === productId);
  }

  toggle(product: Product) {
    if (this.isInWishlist(product.id)) {
      this.remove(product.id);
    } else {
      this.items.push(product);
      this.update();
    }
  }

  remove(productId: number) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.update();
  }

  getItems(): Product[] {
    return this.items;
  }

  private update() {
    this.wishlistSubject.next([...this.items]);
    this.wishlistCount.set(this.items.length);
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
