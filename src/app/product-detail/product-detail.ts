import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../interface/product.interface';
import { ProductService } from '../service/product';
import { CartService } from '../service/cart';
import { WishlistService } from '../service/wishlist';
import { ToastService } from '../service/toast';
import { StarRating } from '../shared/star-rating/star-rating';
import { ProductCard } from '../shared/product-card/product-card';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterLink, StarRating, ProductCard],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  loading = signal(true);
  notFound = signal(false);
  activeImage = signal<string>('');
  quantity = signal(1);

  discountedPrice = computed(() => {
    const product = this.product();
    if (!product) return 0;
    return product.price * (1 - (product.discountPercentage || 0) / 100);
  });

  hasDiscount = computed(() => (this.product()?.discountPercentage || 0) >= 1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      if (!id) {
        this.notFound.set(true);
        this.loading.set(false);
        return;
      }
      this.loadProduct(id);
    });
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.notFound.set(false);
    this.quantity.set(1);
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.activeImage.set(product.images?.[0] || product.thumbnail);
        this.loading.set(false);
        this.loadRelated(product);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  loadRelated(product: Product) {
    this.productService.getByCategory(product.category, { limit: 8 }).subscribe((response) => {
      this.relatedProducts.set(response.products.filter((item) => item.id !== product.id).slice(0, 4));
    });
  }

  isWishlisted(): boolean {
    const product = this.product();
    return product ? this.wishlistService.isInWishlist(product.id) : false;
  }

  toggleWishlist() {
    const product = this.product();
    if (!product) return;
    this.wishlistService.toggle(product);
    this.toastService.show(this.isWishlisted() ? 'Added to wishlist' : 'Removed from wishlist', 'info');
  }

  increaseQty() {
    const product = this.product();
    if (product && this.quantity() < product.stock) {
      this.quantity.update((qty) => qty + 1);
    }
  }

  decreaseQty() {
    this.quantity.update((qty) => Math.max(1, qty - 1));
  }

  addToCart() {
    const product = this.product();
    if (!product) return;
    this.cartService.addToCart(product, this.quantity());
    this.toastService.success(`${product.title} added to cart`);
  }

  buyNow() {
    const product = this.product();
    if (!product) return;
    this.cartService.addToCart(product, this.quantity());
    this.router.navigate(['/cart']);
  }
}
