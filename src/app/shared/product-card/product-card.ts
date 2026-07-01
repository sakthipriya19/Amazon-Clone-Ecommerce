import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../interface/product.interface';
import { CartService } from '../../service/cart';
import { WishlistService } from '../../service/wishlist';
import { ToastService } from '../../service/toast';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, StarRating],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private productSignal = signal<Product | null>(null);
  @Input() set product(value: Product) {
    this.productSignal.set(value);
  }
  get product(): Product {
    return this.productSignal()!;
  }

  discountedPrice = computed(() => {
    const product = this.productSignal();
    if (!product) return 0;
    return product.price * (1 - (product.discountPercentage || 0) / 100);
  });

  hasDiscount = computed(() => (this.productSignal()?.discountPercentage || 0) >= 1);

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  isWishlisted(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }

  goToDetail() {
    this.router.navigate(['/product', this.product.id]);
  }

  addToCart(event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(this.product, 1);
    this.toastService.success(`${this.product.title} added to cart`);
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    this.wishlistService.toggle(this.product);
    this.toastService.show(
      this.isWishlisted() ? 'Added to wishlist' : 'Removed from wishlist',
      'info',
    );
  }
}
