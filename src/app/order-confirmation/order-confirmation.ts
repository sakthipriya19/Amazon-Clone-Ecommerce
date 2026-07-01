import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Ecommerceservice } from '../service/ecommerceservice';
import { Order } from '../interface/ecoomerceinterface';
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

  constructor(private route: ActivatedRoute, private ecommerceService: Ecommerceservice) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const orderId = params['orderId'];
      this.order = this.ecommerceService.getOrderById(orderId);

      if (!this.order) {
        this.orderNotFound = true;
      }
    });
  }

  printOrder() {
    window.print();
  }
}
