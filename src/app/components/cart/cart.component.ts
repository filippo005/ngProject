import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

import {MatCardModule} from '@angular/material/card';
import { HomeComponent } from '../home/home.component';

import {MatButtonModule} from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';



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
  items: any;

  price: string;
  idUser: string;

  total: number = 0;
  countItems: number;

  elements: any;
  stripe: any;

  stripeKey: string = `
  pk_test_51N9B2OILKoaPpOnPk0OdKfLtZK0a1JukFP9dSkar8jbvJVbdpDj7WTw3SQZAD2atWGZOK9ZIAzdSnoWIhJLJcy7400fhojUcSC`;

  constructor(private cartService: CartService, private cookieService: CookieService){}

  ngOnInit(): void {
    const token = this.cookieService.get('_ssU');
    const tokenInfo: any = jwtDecode(token);
    this.idUser = tokenInfo.id;

    this.cartService.getItems(this.idUser).subscribe({
      next: (data: any) => {
        if(data.status == 200){
          this.items = data.items;

          this.items.forEach((item: any) => {
            item.quantity = 1;
          });

          this.totalPrice();

          this.countItems = this.items.length;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  removeQuantity(item: any){
    item.quantity = item.quantity - 1;
    this.totalPrice();

    if(item.quantity == 0){
      this.removeItem(item, this.idUser);
    }
  }

  addQuantity(item: any){
    item.quantity = item.quantity + 1;
    this.totalPrice();
  }

  removeItem(idItem: string, idUser: string){
    this.cartService.removeItem(idItem, idUser).subscribe({
      next: (data: any) => {
        if(data.status == 200){
          window.location.reload();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  totalPrice(){
    this.total = 0;
    this.items.forEach((item: any) => {
      this.total += item.price * item.quantity;
    });

    return this.total.toLocaleString('it-IT', {style: 'currency', currency: 'EUR'});
  }
}
