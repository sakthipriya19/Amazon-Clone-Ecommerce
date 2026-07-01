import { Component } from '@angular/core';
import { Ecommerceservice } from '../service/ecommerceservice';
import { ecommerce } from '../interface/ecoomerceinterface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  loadItems : ecommerce[] =[];
  constructor(private ecommerceService : Ecommerceservice){}
  ngOnInit(){
    this.loadProductDetails()
  }
  loadProductDetails(){
    this.ecommerceService.getClothingDetails().subscribe((data:any)=>{
      this.loadItems = data;
      console.log(data)
    })
  }
}
