import { Component } from '@angular/core';
import { Ecommerceservice } from '../service/ecommerceservice';
import { ecommerce } from '../interface/ecoomerceinterface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { retry } from 'rxjs';

interface ProductWithSelection extends ecommerce {
  selectedQuantity?: number;
  selectedSize?: string;
  selectedColor?: string;
}

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  productDetailsPage: ProductWithSelection[] = [];
  filteredItems: ProductWithSelection[] = [];
  selectedCategory: string = '';
  cartItem: any;
  constructor(private ecommerceservice: Ecommerceservice) {}
  ngOnInit() {
    this.productPageLoadData();
  }
  productPageLoadData() {
    this.ecommerceservice.getClothingDetails().subscribe((data: any) => {
      this.productDetailsPage = data.map((item: ProductWithSelection) => ({
        ...item,
        selectedQuantity: 1,
      }));
      this.filteredItems = this.productDetailsPage;
    });
  }
  applyFilter() {
    if (this.selectedCategory) {
      this.filteredItems = this.productDetailsPage.filter(
        (item) => item.category === this.selectedCategory,
      );
    } else {
      this.filteredItems = this.productDetailsPage;
    }
  }
  addToCart(product: ProductWithSelection) {
    if (!product.selectedSize) {
      alert('Please select a size');
      return;
    }
    if (!product.selectedColor) {
      alert('Please select a color');
      return;
    }
    this.ecommerceservice.setCartAddService(
      product,
      product.selectedQuantity || 1,
      product.selectedSize,
      product.selectedColor
    );
    alert('Added to cart successfully!');
    product.selectedQuantity = 1;
    product.selectedSize = undefined;
    product.selectedColor = undefined;
  }
}
