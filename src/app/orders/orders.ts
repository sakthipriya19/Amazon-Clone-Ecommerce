import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '../interface/product.interface';
import { OrderService } from '../service/order';
import { AuthService } from '../service/auth';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders = signal<Order[]>([]);

  constructor(private orderService: OrderService, private authService: AuthService) {}

  ngOnInit() {
    this.orderService.orders$.subscribe(() => this.refresh());
    this.refresh();
  }

  private refresh() {
    const email = this.authService.currentUser()?.email;
    this.orders.set(email ? this.orderService.getOrdersByEmail(email) : []);
  }
}
