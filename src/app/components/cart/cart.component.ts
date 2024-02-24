import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

import {MatCardModule} from '@angular/material/card';
import { HomeComponent } from '../home/home.component';

import {MatButtonModule} from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    HomeComponent,
    MatButtonModule,
    RouterLink,
    RouterOutlet,
    MatIconModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  items: any = [];

  price: string;

  total: number = 0;
  countItems: number;

  elements: any;
  stripe: any;

  stripeKey: string = `
  pk_test_51N9B2OILKoaPpOnPk0OdKfLtZK0a1JukFP9dSkar8jbvJVbdpDj7WTw3SQZAD2atWGZOK9ZIAzdSnoWIhJLJcy7400fhojUcSC`;

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.countItems = this.cartService.items.length;

    this.items.forEach((item: any) => {
      item.quantity = 1;
    });

    this.totalPrice();
  }

  removeQuantity(item: any){
    item.quantity = item.quantity - 1;

    if(item.quantity == 0){
      this.cartService.removeItem(item);
    }

    this.countItems = this.cartService.items.length;
    this.totalPrice();
  }

  addQuantity(item: any){
    item.quantity = item.quantity + 1;

    this.totalPrice();
  }

  totalPrice(){
    // this.items.forEach((item: any) => {
    //   const p: string = item.price;
    //   const num: number = parseFloat(p.replace(".", ""));

    //   if(!isNaN(num)){
    //     this.total += num;
    //   }
    //   this.price = this.total.toLocaleString(navigator.language, {
    //     style: "currency",
    //     currency: "EUR"
    //   });
    // });
    this.total = 0;
    this.items.forEach((item: any) => {
      this.total += item.price * item.quantity;
    });
  }
}
