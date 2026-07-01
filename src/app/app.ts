import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { CartService } from './service/cart';
import { WishlistService } from './service/wishlist';
import { AuthService } from './service/auth';
import { ProductService } from './service/product';
import { Product } from './interface/product.interface';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  searchQuery = '';
  suggestions = signal<Product[]>([]);
  showSuggestions = signal(false);
  mobileMenuOpen = signal(false);
  accountMenuOpen = signal(false);

  private searchInput$ = new Subject<string>();

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query.trim()) {
            return [];
          }
          return this.productService.search(query, { limit: 5 });
        }),
      )
      .subscribe((response: any) => {
        this.suggestions.set(response?.products || []);
        this.showSuggestions.set(true);
      });
  }

  onSearchInput() {
    this.showSuggestions.set(!!this.searchQuery.trim());
    this.searchInput$.next(this.searchQuery);
  }

  submitSearch() {
    if (!this.searchQuery.trim()) return;
    this.showSuggestions.set(false);
    this.router.navigate(['/products'], { queryParams: { q: this.searchQuery } });
  }

  goToSuggestion(product: Product) {
    this.showSuggestions.set(false);
    this.searchQuery = '';
    this.router.navigate(['/product', product.id]);
  }

  hideSuggestions() {
    setTimeout(() => this.showSuggestions.set(false), 150);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((open) => !open);
  }

  toggleAccountMenu() {
    this.accountMenuOpen.update((open) => !open);
  }

  logout() {
    this.authService.logout();
    this.accountMenuOpen.set(false);
    this.router.navigate(['/']);
  }
}
