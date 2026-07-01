import { Component } from '@angular/core';
import { Ecommerceservice } from '../service/ecommerceservice';
import { CartItem } from '../interface/ecoomerceinterface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  tax: number = 0;
  shipping: number = 0;
  total: number = 0;

  constructor(private ecommerceService: Ecommerceservice) {}

  ngOnInit() {
    this.cartAdd();
  }

  cartAdd() {
    this.ecommerceService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.updateTotals();
    });
  }

  updateTotals() {
    this.subtotal = this.ecommerceService.getSubtotal();
    this.tax = this.ecommerceService.getTax();
    this.shipping = this.ecommerceService.getShippingCost();
    this.total = this.ecommerceService.getTotal();
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity > 0) {
      this.ecommerceService.updateCartItemQuantity(item.id, newQuantity);
    }
  }

  removeItem(item: CartItem) {
    this.ecommerceService.removeFromCart(item.id, item.selectedSize, item.selectedColor);
  }

  clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.ecommerceService.clearCart();
    }
  }
}
