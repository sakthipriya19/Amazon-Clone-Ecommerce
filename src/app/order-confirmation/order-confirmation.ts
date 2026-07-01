import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order } from '../interface/product.interface';
import { OrderService } from '../service/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmation implements OnInit {
  order: Order | undefined;
  orderNotFound: boolean = false;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const orderId = params['orderId'];
      this.order = this.orderService.getOrderById(orderId);

      if (!this.order) {
        this.orderNotFound = true;
      }
    });
  }

  printOrder() {
    window.print();
  }
}
