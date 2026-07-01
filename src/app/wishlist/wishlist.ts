import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../interface/product.interface';
import { WishlistService } from '../service/wishlist';
import { CartService } from '../service/cart';
import { ToastService } from '../service/toast';
import { ProductCard } from '../shared/product-card/product-card';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  items = signal<Product[]>([]);

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.wishlistService.wishlist$.subscribe((items) => this.items.set(items));
  }

  moveAllToCart() {
    this.items().forEach((product) => this.cartService.addToCart(product, 1));
    this.toastService.success('All wishlist items added to cart');
  }
}
