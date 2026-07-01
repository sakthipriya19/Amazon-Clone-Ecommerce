import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Category, Product } from '../interface/product.interface';
import { ProductService } from '../service/product';
import { ProductCard } from '../shared/product-card/product-card';

const PAGE_SIZE = 12;

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  total = signal(0);
  loading = signal(true);

  selectedCategory = '';
  searchQuery = '';
  sort: SortOption = 'relevance';
  page = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total() / PAGE_SIZE));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.productService.getCategories().subscribe((categories) => this.categories.set(categories));

    this.route.queryParams.subscribe((params) => {
      this.selectedCategory = params['category'] || '';
      this.searchQuery = params['q'] || '';
      this.sort = (params['sort'] as SortOption) || 'relevance';
      this.page = Number(params['page']) || 1;
      this.loadProducts();
    });
  }

  private sortParams(): { sortBy?: string; order?: 'asc' | 'desc' } {
    switch (this.sort) {
      case 'price-asc':
        return { sortBy: 'price', order: 'asc' };
      case 'price-desc':
        return { sortBy: 'price', order: 'desc' };
      case 'rating':
        return { sortBy: 'rating', order: 'desc' };
      default:
        return {};
    }
  }

  loadProducts() {
    this.loading.set(true);
    const params = { limit: PAGE_SIZE, skip: (this.page - 1) * PAGE_SIZE, ...this.sortParams() };

    const request$ = this.searchQuery
      ? this.productService.search(this.searchQuery, params)
      : this.selectedCategory
        ? this.productService.getByCategory(this.selectedCategory, params)
        : this.productService.getAll(params);

    request$.subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.total.set(response.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private updateQueryParams(overrides: Record<string, string | number | null>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: overrides,
      queryParamsHandling: 'merge',
    });
  }

  applyCategory() {
    this.updateQueryParams({ category: this.selectedCategory || null, page: null });
  }

  applySort() {
    this.updateQueryParams({ sort: this.sort, page: null });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.updateQueryParams({ page: page === 1 ? null : page });
  }

  clearFilters() {
    this.router.navigate(['/products']);
  }
}
