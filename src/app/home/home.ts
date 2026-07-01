import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category, Product } from '../interface/product.interface';
import { ProductService } from '../service/product';
import { ProductCard } from '../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  categories = signal<Category[]>([]);
  dealsProducts = signal<Product[]>([]);
  topRatedProducts = signal<Product[]>([]);
  forYouProducts = signal<Product[]>([]);
  loading = signal(true);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getCategories().subscribe((categories) => {
      this.categories.set(categories.slice(0, 10));
    });

    this.productService.getAll({ limit: 100 }).subscribe({
      next: (response) => {
        const products = response.products;
        this.dealsProducts.set(
          [...products].sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 8),
        );
        this.topRatedProducts.set([...products].sort((a, b) => b.rating - a.rating).slice(0, 8));

        const randomSkip = Math.floor(Math.random() * Math.max(products.length - 8, 1));
        this.forYouProducts.set(products.slice(randomSkip, randomSkip + 8));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
