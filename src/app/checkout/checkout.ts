import { Component, OnInit } from '@angular/core';
import { CartItem } from '../interface/product.interface';
import { CartService } from '../service/cart';
import { OrderService } from '../service/order';
import { AuthService } from '../service/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  tax: number = 0;
  shipping: number = 0;
  total: number = 0;

  customerName: string = '';
  customerEmail: string = '';
  phone: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  zipCode: string = '';
  country: string = '';

  paymentMethod: string = 'credit-card';
  cardNumber: string = '';
  cardName: string = '';
  expiryDate: string = '';
  cvv: string = '';

  formErrors: string[] = [];
  isProcessing: boolean = false;
  orderPlaced: boolean = false;
  orderId: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.updateTotals();

    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    const user = this.authService.currentUser();
    if (user) {
      this.customerName = user.name;
      this.customerEmail = user.email;
    }
  }

  discountedPrice(item: CartItem): number {
    return item.product.price * (1 - (item.product.discountPercentage || 0) / 100);
  }

  updateTotals() {
    this.subtotal = this.cartService.getSubtotal();
    this.tax = this.cartService.getTax();
    this.shipping = this.cartService.getShippingCost();
    this.total = this.cartService.getTotal();
  }

  validateForm(): boolean {
    this.formErrors = [];

    if (!this.customerName.trim()) this.formErrors.push('Full name is required');
    if (!this.customerEmail.trim() || !this.isValidEmail(this.customerEmail)) {
      this.formErrors.push('Valid email is required');
    }
    if (!this.phone.trim()) this.formErrors.push('Phone number is required');
    if (!this.address.trim()) this.formErrors.push('Address is required');
    if (!this.city.trim()) this.formErrors.push('City is required');
    if (!this.state.trim()) this.formErrors.push('State is required');
    if (!this.zipCode.trim()) this.formErrors.push('Zip code is required');
    if (!this.country.trim()) this.formErrors.push('Country is required');

    if (this.paymentMethod === 'credit-card') {
      if (!this.cardNumber.trim() || this.cardNumber.replace(/\s/g, '').length !== 16) {
        this.formErrors.push('Valid 16-digit card number is required');
      }
      if (!this.cardName.trim()) this.formErrors.push('Cardholder name is required');
      if (!this.expiryDate.trim() || !this.isValidExpiryDate(this.expiryDate)) {
        this.formErrors.push('Valid expiry date (MM/YY) is required');
      }
      if (!this.cvv.trim() || this.cvv.length !== 3) {
        this.formErrors.push('Valid 3-digit CVV is required');
      }
    }

    return this.formErrors.length === 0;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidExpiryDate(date: string): boolean {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return expiryRegex.test(date);
  }

  formatCardNumber() {
    let value = this.cardNumber.replace(/\s/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i += 4) {
      if (i > 0) formattedValue += ' ';
      formattedValue += value.substring(i, i + 4);
    }
    this.cardNumber = formattedValue;
  }

  placeOrder() {
    if (!this.validateForm()) {
      return;
    }

    this.isProcessing = true;

    setTimeout(() => {
      const fullAddress = `${this.address}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
      const order = this.orderService.createOrder(
        this.customerEmail,
        this.customerName,
        fullAddress,
        this.paymentMethod,
      );

      this.orderId = order.id;
      this.orderPlaced = true;
      this.isProcessing = false;

      setTimeout(() => {
        this.router.navigate(['/order-confirmation', this.orderId]);
      }, 2000);
    }, 2000);
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}
