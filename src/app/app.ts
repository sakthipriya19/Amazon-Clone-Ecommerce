import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { Ecommerceservice } from './service/ecommerceservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  cartLength: number = 0;
  protected readonly title = signal('ecommerce');
  
  constructor(private ecommerceService: Ecommerceservice) {
    this.ecommerceService.loadCartFromLocalStorage();
  }

  ngOnInit() {
    this.ecommerceService.cart$.subscribe((items) => {
      this.cartLength = items.length;
    });
  }
}
