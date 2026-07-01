import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartItem } from '../interface/product.interface';
import { CartService } from '../service/cart';
import { ToastService } from '../service/toast';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartItems = signal<CartItem[]>([]);
  subtotal = signal(0);
  tax = signal(0);
  shipping = signal(0);
  total = signal(0);

  constructor(private cartService: CartService, private toastService: ToastService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems.set(items);
      this.updateTotals();
    });
  }

  updateTotals() {
    this.subtotal.set(this.cartService.getSubtotal());
    this.tax.set(this.cartService.getTax());
    this.shipping.set(this.cartService.getShippingCost());
    this.total.set(this.cartService.getTotal());
  }

  discountedPrice(item: CartItem): number {
    return item.product.price * (1 - (item.product.discountPercentage || 0) / 100);
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity > 0 && newQuantity <= item.product.stock) {
      this.cartService.updateQuantity(item.product.id, newQuantity);
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id);
    this.toastService.show(`${item.product.title} removed from cart`, 'info');
  }

  clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart();
    }
  }
}
